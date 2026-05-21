import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('md-preview')
export class MdPreview extends LitElement {
  @property() markdown = '';

  static override styles = css`
    :host {
      display: block;
      color-scheme: light dark;
      color: inherit;
      height: 100%;
      overflow-y: auto;
    }

    pre {
      margin: 0;
      padding: 10px;
      padding-right: 44px;
      white-space: pre-wrap;
      word-break: break-word;
      font-family: monospace;
      font-size: 11px;
      line-height: 1.6;
      min-height: 100%;
      overflow-y: auto;
    }

    pre::selection {
      background: rgba(138, 180, 248, 0.35);
    }

    .empty {
      color: rgba(128, 128, 128, 0.6);
      font-style: italic;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 12px;
      padding: 10px;
    }

    /* Scrollbar */
    pre::-webkit-scrollbar {
      width: 6px;
    }

    pre::-webkit-scrollbar-track {
      background: transparent;
    }

    pre::-webkit-scrollbar-thumb {
      background: rgba(128, 128, 128, 0.3);
      border-radius: 3px;
    }

    pre::-webkit-scrollbar-thumb:hover {
      background: rgba(128, 128, 128, 0.5);
    }
  `;

  protected override render() {
    if (!this.markdown) {
      return html`<p class="empty">Select an element in the Elements panel…</p>`;
    }
    return html`<pre>${this.markdown}</pre>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'md-preview': MdPreview;
  }
}
