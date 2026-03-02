import type { MinimalDocument, MinimalElement, MinimalNode } from './types.js';

const VOID_ELEMENTS = new Set([
  'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input',
  'link', 'meta', 'param', 'source', 'track', 'wbr',
]);

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

class StringNode implements MinimalNode {
  _children: StringNode[] = [];

  appendChild(child: MinimalNode): void {
    this._children.push(child as StringNode);
  }

  get innerHTML(): string {
    return this._children.map((c) => c._serialize()).join('');
  }

  _serialize(): string {
    return this.innerHTML;
  }
}

class StringTextNode extends StringNode {
  constructor(private _text: string) {
    super();
  }

  _serialize(): string {
    return escapeHtml(this._text);
  }
}

class StringElement extends StringNode implements MinimalElement {
  private _tag: string;
  private _attrs: Map<string, string> = new Map();
  src?: string;
  alt?: string;
  href?: string;
  className?: string;

  constructor(tag: string) {
    super();
    this._tag = tag;
  }

  setAttribute(name: string, value: string): void {
    this._attrs.set(name, value);
  }

  _serialize(): string {
    let attrs = '';

    if (this.alt !== undefined) {
      attrs += ` alt="${escapeHtml(this.alt)}"`;
    }
    if (this.src !== undefined) {
      attrs += ` src="${escapeHtml(this.src)}"`;
    }
    if (this.href !== undefined) {
      attrs += ` href="${escapeHtml(this.href)}"`;
    }
    if (this.className !== undefined) {
      attrs += ` class="${escapeHtml(this.className)}"`;
    }
    for (const [k, v] of this._attrs) {
      attrs += ` ${k}="${escapeHtml(v)}"`;
    }

    if (VOID_ELEMENTS.has(this._tag)) {
      return `<${this._tag}${attrs} />`;
    }

    return `<${this._tag}${attrs}>${this.innerHTML}</${this._tag}>`;
  }
}

export class StringDocument implements MinimalDocument {
  createElement(tag: string): MinimalElement {
    return new StringElement(tag);
  }

  createTextNode(text: string): MinimalNode {
    return new StringTextNode(text);
  }
}
