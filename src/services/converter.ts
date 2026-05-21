import TurndownService from 'turndown';

export interface Converter {
  convert(html: string): string;
}

export function createConverter(): Converter {
  const td = new TurndownService({ headingStyle: 'atx', codeBlockStyle: 'fenced' });

  return {
    convert(html: string): string {
      return td.turndown(html);
    },
  };
}
