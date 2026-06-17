import { format } from 'prettier/standalone';
import markdownPlugin from 'prettier/plugins/markdown';

export async function formatMarkdown(md: string): Promise<string> {
  if (!md) {
    return '';
  }
  return format(md, {
    parser: 'markdown',
    plugins: [markdownPlugin],
    proseWrap: 'preserve',
    printWidth: 100,
  });
}
