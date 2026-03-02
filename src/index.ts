/*!
 * Copyright (c) 2011 Ivan Fomichev
 * Portions Copyright (c) 2007 Chris Purcell
 * Copyright (c) 2025 Hatch Head
 * Licensed under MIT license
 */

export { creole, CreoleBase, CreoleRule } from './creole.js';
export type { CreoleOptions, LinkFormat, MinimalDocument, MinimalElement, MinimalNode } from './types.js';
export { StringDocument } from './string-document.js';

import { creole } from './creole.js';
import { StringDocument } from './string-document.js';
import type { CreoleOptions, MinimalElement } from './types.js';

export function toHtml(wikiText: string, options?: CreoleOptions): string {
  const doc = new StringDocument();
  const container = doc.createElement('div') as MinimalElement;
  const parser = new creole(options);
  parser.parse(container, wikiText, { ...options, _document: doc });
  return container.innerHTML;
}
