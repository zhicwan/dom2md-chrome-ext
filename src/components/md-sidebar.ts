import { LitElement, html, css } from 'lit';
import { customElement, query, state } from 'lit/decorators.js';
import { createConverter, type Converter } from '../services/converter.js';
import { copyText } from '../services/clipboard.js';
import { getSelectedHTML } from '../services/devtools-bridge.js';
import type { MdActions } from './md-actions.js';
import './md-actions.js';
import './md-preview.js';

@customElement('md-sidebar')
export class MdSidebar extends LitElement {
  @state() private _markdown = '';
  @state() private _toastMsg = '';
  @state() private _toastError = false;

  @query('md-actions') private _actions!: MdActions;

  private readonly _converter: Converter = createConverter();

  static override styles = css`
    :host {
      display: block;
      position: relative;
      height: 100vh;
      overflow: hidden;
      color-scheme: light dark;
    }

    .actions-wrapper {
      position: fixed;
      top: 6px;
      right: 6px;
      z-index: 10;
      opacity: 0.5;
      transition: opacity 0.2s;
    }

    :host(:hover) .actions-wrapper {
      opacity: 1;
    }

    .toast {
      position: absolute;
      bottom: 8px;
      left: 50%;
      transform: translateX(-50%);
      padding: 4px 12px;
      border-radius: 6px;
      font-size: 11px;
      background: rgba(128, 128, 128, 0.15);
      opacity: 0;
      transition: opacity 0.2s;
      pointer-events: none;
      z-index: 10;
      max-width: 90%;
      text-align: center;
    }

    .toast.visible {
      opacity: 1;
    }

    .toast.error {
      color: #f28b82;
    }
  `;

  override connectedCallback(): void {
    super.connectedCallback();

    chrome.devtools.panels.elements.onSelectionChanged.addListener(() => {
      void this._fetchAndPreview();
    });

    void this._fetchAndPreview();

    document.addEventListener('keydown', this._onKeydown);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    document.removeEventListener('keydown', this._onKeydown);
  }

  protected override render() {
    const toastClasses = ['toast', this._toastMsg ? 'visible' : '', this._toastError ? 'error' : '']
      .filter(Boolean)
      .join(' ');

    return html`
      <div class="actions-wrapper">
        <md-actions @copy-click=${this._onCopy} @refresh-click=${this._onRefresh}></md-actions>
      </div>
      <md-preview .markdown=${this._markdown}></md-preview>
      <div class=${toastClasses}>${this._toastMsg}</div>
    `;
  }

  private async _fetchAndPreview(): Promise<void> {
    try {
      const htmlContent = await getSelectedHTML();
      if (!htmlContent) {
        this._markdown = '';
        this._showToast('No element selected', true);
        return;
      }
      this._clearToast();
      this._markdown = this._converter.convert(htmlContent);
    } catch (e: unknown) {
      this._markdown = '';
      this._showToast('Error: ' + (e instanceof Error ? e.message : String(e)), true);
    }
  }

  private async _onCopy(): Promise<void> {
    if (!this._markdown) {
      await this._fetchAndPreview();
    }
    if (!this._markdown) {
      this._showToast('Nothing to copy — select an element first', true);
      return;
    }
    try {
      await copyText(this._markdown);
      this._clearToast();
      this._actions.showCopied();
    } catch (e: unknown) {
      this._showToast('Clipboard error: ' + (e instanceof Error ? e.message : String(e)), true);
    }
  }

  private _onRefresh(): void {
    void this._fetchAndPreview();
  }

  private readonly _onKeydown = (e: KeyboardEvent): void => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
      const selection = window.getSelection();
      if (selection && selection.isCollapsed && this._markdown) {
        e.preventDefault();
        void this._onCopy();
      }
    }
  };

  private _showToast(msg: string, isError: boolean): void {
    this._toastMsg = msg;
    this._toastError = isError;
  }

  private _clearToast(): void {
    this._toastMsg = '';
    this._toastError = false;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'md-sidebar': MdSidebar;
  }
}
