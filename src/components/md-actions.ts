import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';

// Material Symbols SVG paths
const COPY_PATH =
  'M360-240q-33 0-56.5-23.5T280-320v-480q0-33 23.5-56.5T360-880h360q33 0 56.5 23.5T800-800v480q0 33-23.5 56.5T720-240H360Zm0-80h360v-480H360v480ZM200-80q-33 0-56.5-23.5T120-160v-560h80v560h440v80H200Zm160-240v-480 480Z';
const CHECK_PATH = 'M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z';
const REFRESH_PATH =
  'M480-160q-134 0-227-93t-93-227q0-134 93-227t227-93q69 0 132 28.5T720-690v-110h80v280H520v-80h168q-32-56-87.5-88T480-720q-100 0-170 70t-70 170q0 100 70 170t170 70q77 0 139-44t87-116h84q-28 106-114 173t-196 67Z';

@customElement('md-actions')
export class MdActions extends LitElement {
  @state() private _copied = false;

  private _copyTimer: ReturnType<typeof setTimeout> | null = null;

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    if (this._copyTimer) {
      clearTimeout(this._copyTimer);
      this._copyTimer = null;
    }
  }

  static override styles = css`
    :host {
      display: flex;
      gap: 4px;
    }

    button {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
      border: none;
      border-radius: 6px;
      background: rgba(128, 128, 128, 0.15);
      color: inherit;
      cursor: pointer;
      transition:
        background 0.15s,
        box-shadow 0.15s;
      padding: 0;
    }

    button:hover {
      background: rgba(128, 128, 128, 0.3);
      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.15);
    }

    button:active {
      background: rgba(128, 128, 128, 0.4);
    }

    svg {
      width: 18px;
      height: 18px;
      fill: currentColor;
    }
  `;

  showCopied(): void {
    if (this._copyTimer) {
      clearTimeout(this._copyTimer);
    }
    this._copied = true;
    this._copyTimer = setTimeout(() => {
      this._copied = false;
      this._copyTimer = null;
    }, 1500);
  }

  protected override render() {
    const copyPath = this._copied ? CHECK_PATH : COPY_PATH;

    return html`
      <button title="Copy Markdown" @click=${this._onCopy}>
        <svg viewBox="0 -960 960 960"><path d=${copyPath} /></svg>
      </button>
      <button title="Refresh" @click=${this._onRefresh}>
        <svg viewBox="0 -960 960 960"><path d=${REFRESH_PATH} /></svg>
      </button>
    `;
  }

  private _onCopy(): void {
    this.dispatchEvent(new CustomEvent('copy-click', { bubbles: true, composed: true }));
  }

  private _onRefresh(): void {
    this.dispatchEvent(new CustomEvent('refresh-click', { bubbles: true, composed: true }));
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'md-actions': MdActions;
  }
}
