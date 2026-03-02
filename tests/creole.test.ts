import { describe, it, expect, beforeAll } from 'vitest';
import { creole, toHtml } from '../src/index.js';
import type { CreoleOptions } from '../src/index.js';
import { tests, type TestCase } from './fixtures/creole-tests.js';

function sortAttributes(html: string): string {
  return html.replace(/<(\w+)([^>]*)>/g, (_, tag, attrs) => {
    const attrList: [string, string][] = [];
    const attrRegex = /(\w+)\s*=\s*"([^"]*)"/g;
    let match;
    while ((match = attrRegex.exec(attrs)) !== null) {
      attrList.push([match[1], match[2]]);
    }
    attrList.sort((a, b) => a[0].localeCompare(b[0]));
    const sortedAttrs = attrList.map(([k, v]) => `${k}="${v}"`).join(' ');
    return sortedAttrs ? `<${tag} ${sortedAttrs}>` : `<${tag}>`;
  });
}

function normalizeHtml(html: string): string {
  return sortAttributes(html
    .replace(/\s+/g, ' ')
    .replace(/\s*(<[^>]+>)\s*/g, '$1')
    .replace(/\/>/g, '>')
    .replace(/<\/?tbody>/g, '')
    .replace(/\s+/g, ' ')
    .trim());
}

function getTestOptions(test: TestCase): CreoleOptions {
  const options: CreoleOptions = {
    ...test.options,
    interwiki: {
      MeatBall: 'http://www.usemod.com/cgi-bin/mb.pl?',
      WikiCreole: 'http://www.wikicreole.org/wiki/',
      Palindrome: (link: string) => 'http://www.example.com/wiki/' + link.split('').reverse().join(''),
    },
    linkFormat: '/wiki/',
  };
  return options;
}

function isIE(): boolean {
  return typeof document !== 'undefined' && !!(document as unknown as Record<string, unknown>).all;
}

describe('Creole parser', () => {
  describe('toHtml (string output)', () => {
    it.each(tests)('$name', (test: TestCase) => {
      if (test.forIE && !isIE()) {
        return;
      }

      const options = getTestOptions(test);
      const result = toHtml(test.input, options);
      expect(normalizeHtml(result)).toBe(normalizeHtml(test.output));
    });
  });

  describe('DOM output', () => {
    beforeAll(() => {
      expect(typeof document).toBe('object');
    });

    it.each(tests)('$name', (test: TestCase) => {
      if (test.forIE && !isIE()) {
        return;
      }

      const options = getTestOptions(test);
      const container = document.createElement('div');
      const parser = new creole(options);
      parser.parse(container, test.input, options);

      const expected = document.createElement('div');
      expected.innerHTML = test.output;

      expect(normalizeHtml(container.innerHTML)).toBe(normalizeHtml(expected.innerHTML));
    });
  });
});
