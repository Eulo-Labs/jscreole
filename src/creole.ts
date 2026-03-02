/*!
 * Copyright (c) 2011 Ivan Fomichev
 * Portions Copyright (c) 2007 Chris Purcell
 * Copyright (c) 2025 Hatch Head
 * Licensed under MIT license
 */

import type { CreoleOptions, LinkFormat, MinimalDocument, MinimalElement, MinimalNode } from './types.js';

const DEFAULT_MAX_INPUT_LENGTH = 100 * 1024; // 100KB

function getDoc(options?: CreoleOptions): MinimalDocument {
  if (options && options._document) {
    return options._document;
  }
  if (typeof document !== 'undefined') {
    return document as unknown as MinimalDocument;
  }
  throw new Error('No document available. Pass _document in options or use toHtml().');
}

interface RuleParams {
  _tag?: string;
  _regex?: RegExp | string;
  _capture?: number | null;
  _replaceRegex?: RegExp;
  _replaceString?: string;
  _children?: RuleParams[];
  _fallback?: RuleParams | CreoleRule;
  _attrs?: Record<string, string>;
  _build?: (this: CreoleRule, node: MinimalNode, r: RegExpMatchArray, options?: CreoleOptions) => void;
  _match?: (data: string, options?: CreoleOptions) => RegExpMatchArray | null;
  _apply?: (node: MinimalNode, data: string, options?: CreoleOptions) => CreoleRule;
  [key: string]: unknown;
}

const formatLink = function (link: string, format: LinkFormat): string {
  if (format instanceof Function) {
    return format(link);
  }

  const arr = Array.isArray(format) ? format : [format];
  const trailing = typeof arr[1] === 'undefined' ? '' : arr[1];
  return arr[0] + link + trailing;
};

const creole = function (this: CreoleBase, options?: CreoleOptions) {
  const rx: Record<string, string> = {};
  rx._link = '[^\\]|~\\n]*(?:(?:\\](?!\\])|~.)[^\\]|~\\n]*)*';
  rx._linkText = '[^\\]~\\n]*(?:(?:\\](?!\\])|~.)[^\\]~\\n]*)*';
  rx._uriPrefix = '\\b(?:(?:https?|ftp)://|mailto:)';
  rx._uri = rx._uriPrefix + rx._link;
  rx._rawUri = rx._uriPrefix + '\\S*[^\\s!"\',.:;?]';
  rx._interwikiLink = '[\\w.]+:' + rx._link;
  rx._img = '\\{\\{((?!\\{)[^|}\\n]*(?:}(?!})[^|}\\n]*)*)' +
    (options && options.strict ? '' : '(?:') +
    '\\|([^}~\\n]*((}(?!})|~.)[^}~\\n]*)*)' +
    (options && options.strict ? '' : ')?') +
    '}}';

  const g: Record<string, RuleParams> = {
    _hr: { _tag: 'hr', _regex: /(^|\n)\s*----\s*(\n|$)/ },

    _br: { _tag: 'br', _regex: /\\\\/ },

    _preBlock: {
      _tag: 'pre', _capture: 2,
      _regex: /(^|\n)\{\{\{\n((.*\n)*?)\}\}\}(\n|$)/,
      _replaceRegex: /^ ([ \t]*\}\}\})/gm,
      _replaceString: '$1',
    },
    _tt: {
      _tag: 'tt',
      _regex: /\{\{\{(.*?\}\}\}+)/, _capture: 1,
      _replaceRegex: /\}\}\}$/, _replaceString: '',
    },

    _ulist: {
      _tag: 'ul', _capture: 0,
      _regex: /(^|\n)([ \t]*\*[^*#].*(\n|$)([ \t]*[^\s*#].*(\n|$))*([ \t]*[*#]{2}.*(\n|$))*)+/,
    },
    _olist: {
      _tag: 'ol', _capture: 0,
      _regex: /(^|\n)([ \t]*#[^*#].*(\n|$)([ \t]*[^\s*#].*(\n|$))*([ \t]*[*#]{2}.*(\n|$))*)+/,
    },
    _li: {
      _tag: 'li', _capture: 0,
      _regex: /[ \t]*([*#]).+(\n[ \t]*[^*#\s].*)*(\n[ \t]*[*#]{2}.+)*/,
      _replaceRegex: /(^|\n)[ \t]*[*#]/g, _replaceString: '$1',
    },

    _table: {
      _tag: 'table', _capture: 0,
      _regex: /(^|\n)(\|.*?[ \t]*(\n|$))+/,
    },
    _tr: { _tag: 'tr', _capture: 2, _regex: /(^|\n)(\|.*?)\|?[ \t]*(\n|$)/ },
    _th: { _tag: 'th', _regex: /\|+=([^|]*)/, _capture: 1 },
    _td: {
      _tag: 'td', _capture: 1,
      _regex: '\\|+([^|~\\[{]*((~(.|(?=\\n)|$)|' +
        '\\[\\[' + rx._link + '(\\|' + rx._linkText + ')?\\]\\]' +
        (options && options.strict ? '' : '|' + rx._img) +
        '|[\\[{])[^|~]*)*)' as unknown as RegExp,
    },

    _singleLine: { _regex: /.+/, _capture: 0 },
    _paragraph: {
      _tag: 'p', _capture: 0,
      _regex: /(^|\n)([ \t]*\S.*(\n|$))+/,
    },
    _text: { _capture: 0, _regex: /(^|\n)([ \t]*[^\s].*(\n|$))+/ },

    _strong: {
      _tag: 'strong', _capture: 1,
      _regex: /\*\*([^*~]*((\*(?!\*)|~(.|(?=\n)|$))[^*~]*)*)(\*\*|\n|$)/,
    },
    _em: {
      _tag: 'em', _capture: 1,
      _regex: ('\\/\\/(((?!' + rx._uriPrefix + ')[^\\/~])*' +
        '((' + rx._rawUri + '|\\/(?!\\/)|~(.|(?=\\n)|$))' +
        '((?!' + rx._uriPrefix + ')[^\\/~])*)*)(\\/\\/|\\n|$)') as unknown as RegExp,
    },

    _img: {
      _regex: rx._img as unknown as RegExp,
      _build: function (this: CreoleRule, node: MinimalNode, r: RegExpMatchArray, options?: CreoleOptions) {
        const doc = getDoc(options);
        const img = doc.createElement('img');
        img.src = r[1];
        img.alt = r[2] === undefined
          ? (options && options.defaultImageText ? options.defaultImageText : '')
          : r[2].replace(/~(.)/g, '$1');
        (node as MinimalElement).appendChild(img);
      },
    },

    _namedUri: {
      _regex: ('\\[\\[(' + rx._uri + ')\\|(' + rx._linkText + ')\\]\\]') as unknown as RegExp,
      _build: function (this: CreoleRule, node: MinimalNode, r: RegExpMatchArray, options?: CreoleOptions) {
        const doc = getDoc(options);
        const link = doc.createElement('a');
        link.href = r[1];
        if (options && options.isPlainUri) {
          link.appendChild(doc.createTextNode(r[2]));
        } else {
          this._apply(link, r[2], options);
        }
        (node as MinimalElement).appendChild(link);
      },
    },

    _namedLink: {
      _regex: ('\\[\\[(' + rx._link + ')\\|(' + rx._linkText + ')\\]\\]') as unknown as RegExp,
      _build: function (this: CreoleRule, node: MinimalNode, r: RegExpMatchArray, options?: CreoleOptions) {
        const doc = getDoc(options);
        const link = doc.createElement('a');

        link.href = options && options.linkFormat
          ? formatLink(r[1].replace(/~(.)/g, '$1'), options.linkFormat)
          : r[1].replace(/~(.)/g, '$1');
        this._apply(link, r[2], options);

        (node as MinimalElement).appendChild(link);
      },
    },

    _unnamedUri: { _regex: ('\\[\\[(' + rx._uri + ')\\]\\]') as unknown as RegExp },
    _unnamedLink: { _regex: ('\\[\\[(' + rx._link + ')\\]\\]') as unknown as RegExp },
    _unnamedInterwikiLink: { _regex: ('\\[\\[(' + rx._interwikiLink + ')\\]\\]') as unknown as RegExp },

    _rawUri: { _regex: ('(' + rx._rawUri + ')') as unknown as RegExp },

    _escapedSequence: {
      _regex: ('~(' + rx._rawUri + '|.)') as unknown as RegExp, _capture: 1,
      _tag: 'span', _attrs: { 'class': 'escaped' },
    },
    _escapedSymbol: {
      _regex: /~(.)/, _capture: 1,
      _tag: 'span', _attrs: { 'class': 'escaped' },
    },
  };

  g._unnamedUri._build = g._rawUri._build = function (this: CreoleRule, node: MinimalNode, r: RegExpMatchArray, options?: CreoleOptions) {
    if (!options) { options = {}; }
    options.isPlainUri = true;
    g._namedUri._build!.call(this, node, [r[0], r[1], r[1]] as unknown as RegExpMatchArray, options);
  };
  g._unnamedLink._build = function (this: CreoleRule, node: MinimalNode, r: RegExpMatchArray, options?: CreoleOptions) {
    g._namedLink._build!.call(this, node, [r[0], r[1], r[1]] as unknown as RegExpMatchArray, options);
  };

  g._namedInterwikiLink = {
    _regex: ('\\[\\[(' + rx._interwikiLink + ')\\|(' + rx._linkText + ')\\]\\]') as unknown as RegExp,
    _build: function (this: CreoleRule, node: MinimalNode, r: RegExpMatchArray, options?: CreoleOptions) {
      const doc = getDoc(options);
      const link = doc.createElement('a');

      let m: RegExpMatchArray | null = null;
      let f: LinkFormat | undefined;
      if (options && options.interwiki) {
        m = r[1].match(/(.*?):(.*)/);
        if (m) {
          f = options.interwiki[m[1]];
        }
      }

      if (typeof f === 'undefined') {
        if (!(g._namedLink as RuleParams & { _apply?: unknown })._apply) {
          g._namedLink = new (this.constructor as typeof CreoleRule)(g._namedLink) as unknown as RuleParams;
        }
        return (g._namedLink as unknown as CreoleRule)._build(node, r, options);
      }

      link.href = formatLink(m![2].replace(/~(.)/g, '$1'), f);

      this._apply(link, r[2], options);

      (node as MinimalElement).appendChild(link);
    },
  };
  g._unnamedInterwikiLink._build = function (this: CreoleRule, node: MinimalNode, r: RegExpMatchArray, options?: CreoleOptions) {
    g._namedInterwikiLink._build!.call(this, node, [r[0], r[1], r[1]] as unknown as RegExpMatchArray, options);
  };
  g._namedUri._children = g._unnamedUri._children = g._rawUri._children =
    g._namedLink._children = g._unnamedLink._children =
    g._namedInterwikiLink._children = g._unnamedInterwikiLink._children =
    [g._escapedSymbol, g._img];

  for (let i = 1; i <= 6; i++) {
    g['h' + i] = {
      _tag: 'h' + i, _capture: 2,
      _regex: ('(^|\\n)[ \\t]*={' + i + '}[ \\t]*' +
        '([^\\n=][^~]*?(~(.|(?=\\n)|$))*)[ \\t]*=*\\s*(\\n|$)') as unknown as RegExp,
    };
  }

  g._ulist._children = g._olist._children = [g._li];
  g._li._children = [g._ulist, g._olist];
  g._li._fallback = g._text;

  g._table._children = [g._tr];
  g._tr._children = [g._th, g._td];
  g._td._children = [g._singleLine];
  g._th._children = [g._singleLine];

  g.h1._children = g.h2._children = g.h3._children =
    g.h4._children = g.h5._children = g.h6._children =
    g._singleLine._children = g._paragraph._children =
    g._text._children = g._strong._children = g._em._children =
    [g._escapedSequence, g._strong, g._em, g._br, g._rawUri,
      g._namedUri, g._namedInterwikiLink, g._namedLink,
      g._unnamedUri, g._unnamedInterwikiLink, g._unnamedLink,
      g._tt, g._img];

  g._root = {
    _children: [g.h1, g.h2, g.h3, g.h4, g.h5, g.h6,
      g._hr, g._ulist, g._olist, g._preBlock, g._table],
    _fallback: { _children: [g._paragraph] },
  };

  CreoleBase.call(this, g, options);
} as unknown as { new(options?: CreoleOptions): CreoleBase; prototype: CreoleBase };

const CreoleBase = function (this: CreoleBase, grammar?: Record<string, RuleParams>, options?: CreoleOptions) {
  if (!arguments.length) { return; }

  this._grammar = grammar!;
  this._grammar._root = new (this._ruleConstructor as typeof CreoleRule)(this._grammar._root) as unknown as RuleParams;
  this._options = options;
} as unknown as { new(grammar?: Record<string, RuleParams>, options?: CreoleOptions): CreoleBase; prototype: CreoleBase; call(thisArg: unknown, grammar?: Record<string, RuleParams>, options?: CreoleOptions): void };

interface CreoleBase {
  _ruleConstructor: typeof CreoleRule | null;
  _grammar: Record<string, RuleParams>;
  _options: CreoleOptions | undefined;
  parse(node: MinimalNode, data: string, options?: CreoleOptions): void;
}

class CreoleRule {
  _tag?: string;
  _regex?: RegExp | string;
  _capture!: number | null;
  _replaceRegex?: RegExp;
  _replaceString?: string;
  _children!: (RuleParams | CreoleRule)[];
  _fallback!: RuleParams | CreoleRule;
  _attrs?: Record<string, string>;
  _build!: (this: CreoleRule, node: MinimalNode, r: RegExpMatchArray, options?: CreoleOptions) => void;
  _match!: (data: string, options?: CreoleOptions) => RegExpMatchArray | null;
  _apply!: (node: MinimalNode, data: string, options?: CreoleOptions) => CreoleRule;

  constructor(params?: RuleParams) {
    if (!params) {
      this._capture = null;
      this._children = [];
      this._fallback = CreoleRule.prototype._fallback;
      this._build = CreoleRule.prototype._build;
      this._match = CreoleRule.prototype._match;
      this._apply = CreoleRule.prototype._apply;
      return;
    }

    for (const p in params) {
      (this as Record<string, unknown>)[p] = (params as Record<string, unknown>)[p];
    }
    this._capture = params._capture !== undefined ? params._capture : null!;
    if (!this._children) { this._children = []; }
    if (!this._fallback) { this._fallback = CreoleRule.prototype._fallback; }
    if (!this._build) { this._build = CreoleRule.prototype._build; }
    if (!this._match) { this._match = CreoleRule.prototype._match; }
    if (!this._apply) { this._apply = CreoleRule.prototype._apply; }
  }
}

CreoleRule.prototype._match = function (this: CreoleRule, data: string, _options?: CreoleOptions): RegExpMatchArray | null {
  return data.match(this._regex as RegExp);
};

CreoleRule.prototype._build = function (this: CreoleRule, node: MinimalNode, r: RegExpMatchArray, options?: CreoleOptions): void {
  let data: string | undefined;
  if (this._capture !== null) {
    data = r[this._capture];
  }

  let target: MinimalNode;
  if (this._tag) {
    const doc = getDoc(options);
    target = doc.createElement(this._tag);
    (node as MinimalElement).appendChild(target);
  } else {
    target = node;
  }

  if (data) {
    if (this._replaceRegex) {
      data = data.replace(this._replaceRegex, this._replaceString!);
    }
    this._apply(target, data, options);
  }

  if (this._attrs) {
    for (const i in this._attrs) {
      (target as MinimalElement).setAttribute(i, this._attrs[i]);
      if (options && options.forIE && i === 'class') {
        (target as MinimalElement).className = this._attrs[i];
      }
    }
  }
};

CreoleRule.prototype._apply = function (this: CreoleRule, node: MinimalNode, data: string, options?: CreoleOptions): CreoleRule {
  let tail = '' + data;
  const matches: (RegExpMatchArray | null | undefined)[] = [];

  if (!(this._fallback as CreoleRule)._apply || typeof (this._fallback as CreoleRule)._apply !== 'function') {
    this._fallback = new CreoleRule(this._fallback as RuleParams);
  }

  while (true) {
    let best: RegExpMatchArray | false = false;
    let rule: RuleParams | CreoleRule | false = false;
    for (let i = 0; i < this._children.length; i++) {
      if (typeof matches[i] === 'undefined') {
        if (!(this._children[i] as CreoleRule)._match || typeof (this._children[i] as CreoleRule)._match !== 'function') {
          this._children[i] = new CreoleRule(this._children[i] as RuleParams);
        }
        matches[i] = (this._children[i] as CreoleRule)._match(tail, options);
      }
      if (matches[i] && (!best || best.index! > matches[i]!.index!)) {
        best = matches[i]!;
        rule = this._children[i];
        if (best.index === 0) { break; }
      }
    }

    const pos = best ? best.index! : tail.length;
    if (pos > 0) {
      (this._fallback as CreoleRule)._apply(node, tail.substring(0, pos), options);
    }

    if (!best) { break; }

    if (!(rule as CreoleRule)._build || typeof (rule as CreoleRule)._build !== 'function') {
      rule = new CreoleRule(rule as RuleParams);
    }
    (rule as CreoleRule)._build(node, best, options);

    const chopped = best.index! + best[0].length;
    tail = tail.substring(chopped);
    for (let i = 0; i < this._children.length; i++) {
      if (matches[i]) {
        if (matches[i]!.index! >= chopped) {
          (matches[i] as RegExpMatchArray).index = matches[i]!.index! - chopped;
        } else {
          matches[i] = undefined;
        }
      }
    }
  }

  return this;
};

CreoleRule.prototype._fallback = {
  _apply: function (node: MinimalNode, data: string, options?: CreoleOptions) {
    if (options && options.forIE) {
      data = data.replace(/\n/g, ' \r');
    }
    const doc = getDoc(options);
    (node as MinimalElement).appendChild(doc.createTextNode(data));
  },
} as unknown as CreoleRule;

CreoleBase.prototype = {
  _ruleConstructor: null,
  _grammar: null as unknown as Record<string, RuleParams>,
  _options: undefined,

  parse: function (this: CreoleBase, node: MinimalNode, data: string, options?: CreoleOptions) {
    if (options) {
      if (this._options) {
        for (const i in this._options) {
          if (typeof (options as Record<string, unknown>)[i] === 'undefined') {
            (options as Record<string, unknown>)[i] = (this._options as Record<string, unknown>)[i];
          }
        }
      }
    } else {
      options = this._options;
    }

    const maxLen = (options && options.maxInputLength) || DEFAULT_MAX_INPUT_LENGTH;
    if (data.length > maxLen) {
      throw new Error(`Input exceeds maximum length of ${maxLen} bytes`);
    }

    data = data.replace(/\r\n?/g, '\n');
    (this._grammar._root as unknown as CreoleRule)._apply(node, data, options);
    if (options && options.forIE) {
      (node as MinimalElement).innerHTML = (node as MinimalElement).innerHTML.replace(/\r?\n/g, '\r\n');
    }
  },
};

(CreoleBase.prototype as unknown as { constructor: unknown }).constructor = CreoleBase;
(CreoleBase.prototype as CreoleBase)._ruleConstructor = CreoleRule;

(creole as unknown as { _base: typeof CreoleBase })._base = CreoleBase;
(creole as unknown as { _rule: typeof CreoleRule })._rule = CreoleRule;
creole.prototype = new (CreoleBase as unknown as { new(): CreoleBase })();
(creole.prototype as unknown as { constructor: unknown }).constructor = creole;

export { creole, CreoleBase, CreoleRule };
