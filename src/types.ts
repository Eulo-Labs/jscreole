export type LinkFormat = string | [string, string?] | ((link: string) => string);

export interface CreoleOptions {
  /** Whether the parser is strict Creole 1.0 */
  strict?: boolean;
  /** Internal links' format */
  linkFormat?: LinkFormat;
  /** Interwiki map */
  interwiki?: Record<string, LinkFormat>;
  /** Alternative text for an image with no alternative text */
  defaultImageText?: string;
  /** IE compatibility mode (deprecated) */
  forIE?: boolean;
  /** Maximum input length in bytes (default 100KB, ReDoS protection) */
  maxInputLength?: number;
  /** Whether this is a plain URI context (internal use) */
  isPlainUri?: boolean;
  /** Document implementation to use (internal use) */
  _document?: MinimalDocument;
}

export interface MinimalDocument {
  createElement(tag: string): MinimalElement;
  createTextNode(text: string): MinimalNode;
}

export interface MinimalNode {
  appendChild(child: MinimalNode): void;
}

export interface MinimalElement extends MinimalNode {
  innerHTML: string;
  src?: string;
  alt?: string;
  href?: string;
  className?: string;
  setAttribute(name: string, value: string): void;
  appendChild(child: MinimalNode): void;
}
