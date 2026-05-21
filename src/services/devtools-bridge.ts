interface EvalError {
  isError: boolean;
  code: string;
  description: string;
  details: unknown[];
}

export function getSelectedHTML(): Promise<string | null> {
  return new Promise((resolve, reject) => {
    chrome.devtools.inspectedWindow.eval('$0 ? $0.outerHTML : null', (result: unknown, error?: EvalError) => {
      if (error) {
        reject(new Error(error.description ?? 'eval failed'));
      } else {
        resolve(result as string | null);
      }
    });
  });
}
