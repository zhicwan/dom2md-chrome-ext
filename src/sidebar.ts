declare class TurndownService {
  constructor(options?: { headingStyle?: string; codeBlockStyle?: string });
  public turndown(html: string): string;
}

(() => {
  const preview = document.getElementById('preview') as HTMLPreElement;
  const statusEl = document.getElementById('status') as HTMLDivElement;
  const copyBtn = document.getElementById('copy-btn') as HTMLButtonElement;
  const refreshBtn = document.getElementById('refresh-btn') as HTMLButtonElement;

  const turndown = new TurndownService({ headingStyle: 'atx', codeBlockStyle: 'fenced' });

  let currentMarkdown = '';

  type StatusType = '' | 'success' | 'error';

  function setStatus(msg: string, type: StatusType = ''): void {
    statusEl.textContent = msg;
    statusEl.className = type;
    if (type === 'success') {
      setTimeout(() => {
        statusEl.textContent = '';
        statusEl.className = '';
      }, 2000);
    }
  }

  function getSelectedHTML(callback: (html: string | null, err: string | null) => void): void {
    chrome.devtools.inspectedWindow.eval(
      '$0 ? $0.outerHTML : null',
      (result: unknown, error?: { isError: boolean; code: string; description: string; details: unknown[] }) => {
        if (error) {
          callback(null, error.description ?? 'eval failed');
        } else {
          callback(result as string | null, null);
        }
      },
    );
  }

  function convertAndDisplay(html: string | null): void {
    if (!html) {
      currentMarkdown = '';
      preview.textContent = '';
      return;
    }
    try {
      currentMarkdown = turndown.turndown(html);
      preview.textContent = currentMarkdown;
    } catch (e) {
      currentMarkdown = '';
      preview.textContent = '';
      setStatus('Conversion error: ' + (e instanceof Error ? e.message : String(e)), 'error');
    }
  }

  function fetchAndPreview(): void {
    getSelectedHTML((html, err) => {
      if (err) {
        setStatus('Error: ' + err, 'error');
        return;
      }
      if (!html) {
        setStatus('No element selected', 'error');
        currentMarkdown = '';
        preview.textContent = '';
        return;
      }
      setStatus('');
      convertAndDisplay(html);
    });
  }

  // Live Preview: auto-refresh on selection change
  chrome.devtools.panels.elements.onSelectionChanged.addListener(() => {
    fetchAndPreview();
  });

  // Initial fetch on sidebar load
  fetchAndPreview();

  // Button Handlers
  copyBtn.addEventListener('click', () => {
    if (!currentMarkdown) {
      fetchAndPreview();
      setTimeout(() => copyToClipboard(), 300);
      return;
    }
    copyToClipboard();
  });

  refreshBtn.addEventListener('click', () => {
    fetchAndPreview();
  });

  function copyToClipboard(): void {
    if (!currentMarkdown) {
      setStatus('Nothing to copy — select an element first', 'error');
      return;
    }
    navigator.clipboard.writeText(currentMarkdown).then(
      () => setStatus('Copied!', 'success'),
      (err: Error) => setStatus('Clipboard error: ' + err.message, 'error'),
    );
  }
})();
