interface EvalError {
  isError: boolean;
  code: string;
  description: string;
  details: unknown[];
}

export interface SelectedContent {
  html: string;
  baseURL: string;
  pageURL: string;
}

export function getSelectedHTML(): Promise<SelectedContent | null> {
  return new Promise((resolve, reject) => {
    chrome.devtools.inspectedWindow.eval(
      '$0 ? ({ html: $0.outerHTML, baseURL: location.origin, pageURL: location.href.split("#")[0] }) : null',
      (result: unknown, error?: EvalError) => {
        if (error) {
          reject(new Error(error.description ?? 'eval failed'));
        } else {
          resolve(result as SelectedContent | null);
        }
      },
    );
  });
}
