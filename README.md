# jscreole

A JavaScript library for parsing Creole 1.0 wiki markup. This is a modernized fork with TypeScript support and both DOM and HTML string output.

## Installation

```bash
npm install jscreole
```

## Usage

### HTML String Output

```javascript
import { toHtml } from 'jscreole';

const html = toHtml('**bold** and //italic//');
// => '<p><strong>bold</strong> and <em>italic</em></p>'
```

### DOM Output (Browser)

```javascript
import { creole } from 'jscreole';

const parser = new creole({
  linkFormat: '/wiki/',
  interwiki: {
    Wikipedia: 'https://en.wikipedia.org/wiki/'
  }
});

const container = document.createElement('div');
parser.parse(container, '[[Wikipedia:JavaScript]]');
// container.innerHTML => '<p><a href="https://en.wikipedia.org/wiki/JavaScript">Wikipedia:JavaScript</a></p>'
```

### Node.js with jsdom

```javascript
const { creole } = require('jscreole');
const { JSDOM } = require('jsdom');

const dom = new JSDOM();
const parser = new creole();
const container = dom.window.document.createElement('div');
parser.parse(container, '* list item');
```

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `strict` | boolean | false | Strict Creole 1.0 mode (e.g., requires image alt text) |
| `linkFormat` | string \| [string, string?] \| function | - | Format for internal wiki links |
| `interwiki` | Record<string, LinkFormat> | - | Interwiki link mappings |
| `defaultImageText` | string | '' | Default alt text for images without alt text |
| `maxInputLength` | number | 102400 | Maximum input length (100KB default, ReDoS protection) |

### Link Formats

Link formats can be:
- A string prefix: `'/wiki/'` → `/wiki/MyPage`
- An array with prefix and suffix: `['/pages/', '/view']` → `/pages/MyPage/view`
- A function: `(link) => '/page/' + link.toLowerCase()`

## API

### `toHtml(wikiText: string, options?: CreoleOptions): string`

Parse Creole markup and return HTML string. Use this for server-side rendering or when you don't need DOM manipulation.

### `new creole(options?: CreoleOptions)`

Create a new parser instance.

#### `parser.parse(container: Element, wikiText: string, options?: CreoleOptions): void`

Parse Creole markup and append the result to the container element.

## Security

The parser includes ReDoS protection via an input length guard (default 100KB). You can adjust this with the `maxInputLength` option.

## License

MIT License. Original implementation by Ivan Fomichev, with portions by Chris Purcell.

## Creole 1.0 Support

This parser implements the full Creole 1.0 specification. See http://www.wikicreole.org/wiki/Creole1.0 for details.
