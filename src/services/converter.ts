import TurndownService from 'turndown';
import { gfm } from 'turndown-plugin-gfm';
import { formatMarkdown } from './formatter.js';

export interface Converter {
  convert(html: string, baseURL?: string, pageURL?: string): Promise<string>;
}

function resolveRelativeURLs(html: string, baseURL: string, pageURL: string): string {
  return (
    html
      // Resolve absolute-path URLs (/path/to/page) but not protocol-relative (//host)
      .replace(/((?:href|src)\s*=\s*["'])(\/(?!\/)[^"']*)/gi, (_, prefix, path) => prefix + baseURL + path)
      // Resolve fragment-only URLs (#anchor)
      .replace(/(href\s*=\s*["'])(#[^"']*)/gi, (_, prefix, hash) => prefix + pageURL + hash)
  );
}

export function createConverter(): Converter {
  const td = new TurndownService({
    headingStyle: 'atx',
    codeBlockStyle: 'fenced',
    bulletListMarker: '-',
    emDelimiter: '*',
    preformattedCode: true,
    blankReplacement(_content, node) {
      const meaningful = ['TABLE', 'THEAD', 'TBODY', 'TFOOT', 'TH', 'TD', 'PRE', 'VIDEO', 'AUDIO'];
      const n = node as unknown as { isBlock: boolean; nodeName: string };
      if (n.isBlock) {
        return meaningful.includes(n.nodeName) ? '\n\n' : '';
      }
      return '';
    },
  });

  // Reduce aggressive escaping for technical content while preserving safety
  td.escape = (str: string) => {
    // Escape block-level constructs that would change document structure
    let result = str;
    result = result.replace(/^(#{1,6}\s)/gm, '\\$1');
    result = result.replace(/^(\s*>)/gm, '\\$1');
    result = result.replace(/^(\s*[-*+]\s)/gm, '\\$1');
    result = result.replace(/^(\s*\d+\.\s)/gm, '\\$1');
    // Escape inline chars that could break link/image syntax
    result = result.replace(/([[\]])/g, '\\$1');
    return result;
  };

  td.use(gfm);

  td.remove(['script', 'style', 'noscript']);

  // Strip interactive/decorative UI elements
  td.addRule('removeUIChrome', {
    filter(node) {
      const el = node as unknown as HTMLElement;
      // Only strip icon-only buttons (no meaningful text)
      if (el.nodeName === 'BUTTON') {
        const text = el.textContent?.trim() || '';
        return text.length === 0 || text.length <= 2;
      }
      if (el.nodeName === 'SVG') {
        return true;
      }
      if (el.nodeName === 'SPAN' && el.getAttribute?.('aria-hidden') === 'true') {
        return true;
      }
      return false;
    },
    replacement() {
      return '';
    },
  });

  // Buttons with text content render inline
  td.addRule('buttonInline', {
    filter: 'button',
    replacement(content) {
      return content.replace(/\n+/g, ' ').replace(/\s+/g, ' ').trim();
    },
  });

  // Treat role="button" elements as inline (collapse inner newlines)
  td.addRule('roleButton', {
    filter(node) {
      const el = node as unknown as HTMLElement;
      return el.getAttribute?.('role') === 'button';
    },
    replacement(content) {
      return content.replace(/\n+/g, ' ').replace(/\s+/g, ' ').trim();
    },
  });

  // Heading rule that collapses inner block elements to inline text
  td.addRule('heading', {
    filter: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
    replacement(content, node) {
      const level = Number(node.nodeName.charAt(1));
      const text = content.replace(/\n+/g, ' ').replace(/\s+/g, ' ').trim();
      if (!text) {
        return '';
      }
      return `\n\n${'#'.repeat(level)} ${text}\n\n`;
    },
  });

  // Link rule that collapses inner block elements to inline text
  td.addRule('link', {
    filter(node) {
      return node.nodeName === 'A' && !!(node as unknown as HTMLAnchorElement).getAttribute('href');
    },
    replacement(content, node) {
      const el = node as unknown as HTMLAnchorElement;
      const href = el.getAttribute('href') || '';
      const text = content.replace(/\n+/g, ' ').replace(/\s+/g, ' ').trim();
      if (!text) {
        return '';
      }
      const title = el.getAttribute('title');
      return title ? `[${text}](${href} "${title}")` : `[${text}](${href})`;
    },
  });

  // <figure>/<figcaption> → ![caption](src)
  td.addRule('figure', {
    filter: 'figure',
    replacement(content, node) {
      const el = node as unknown as HTMLElement;
      const img = el.querySelector?.('img');
      const figcaption = el.querySelector?.('figcaption');
      if (img) {
        const src = img.getAttribute('src') || '';
        const alt = figcaption?.textContent?.trim() || img.getAttribute('alt') || '';
        return `\n\n![${alt}](${src})\n\n`;
      }
      // Non-image figure: just return content
      return `\n\n${content}\n\n`;
    },
  });

  // <details>/<summary> → preserved as HTML details block
  td.addRule('details', {
    filter: 'details',
    replacement(content, node) {
      const el = node as unknown as HTMLElement;
      const summary = el.querySelector?.('summary');
      const summaryText = summary?.textContent?.trim() || 'Details';
      const body = content.trim();
      return `\n\n<details>\n<summary>${summaryText}</summary>\n\n${body}\n\n</details>\n\n`;
    },
  });

  // Strip <summary> so it doesn't duplicate inside <details>
  td.addRule('summary', {
    filter: 'summary',
    replacement() {
      return '';
    },
  });

  return {
    async convert(html: string, baseURL?: string, pageURL?: string): Promise<string> {
      let processed = html;
      // Resolve relative URLs
      if (baseURL) {
        processed = resolveRelativeURLs(processed, baseURL, pageURL || baseURL);
      }
      // Pre-process: convert <br> in code blocks to newlines
      processed = processed.replace(/(<pre[^>]*>[\s\S]*?<\/pre>)/g, match => match.replace(/<br\s*\/?>/gi, '\n'));
      const md = td.turndown(processed);
      // Format with Prettier (handles trailing whitespace, blank lines, indentation)
      return formatMarkdown(md);
    },
  };
}
