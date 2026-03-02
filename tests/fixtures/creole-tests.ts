export interface TestCase {
  name: string;
  input: string;
  output: string;
  forIE?: boolean;
  options?: Record<string, unknown>;
}

export const tests: TestCase[] = [
  {
    name:   "Basic paragraph markup",
    input:  "Basic paragraph test with <, >, & and \"",
    output: "<p>Basic paragraph test with &lt;, &gt;, &amp; and \"</p>"
  },
  {
    name:   "Simple unordered list",
    input:  "* list item\n*list item 2",
    output: "<ul><li> list item</li>\n<li>list item 2</li></ul>"
  },
  {
    name:   "Simple ordered list",
    input:  "# list item\n#list item 2",
    output: "<ol><li> list item</li>\n<li>list item 2</li></ol>"
  },
  {
    name:   "Unordered item with unordered sublist",
    input:  "* Item\n** Subitem",
    output: "<ul><li> Item<ul>\n<li> Subitem</li></ul></li></ul>"
  },
  {
    name:   "Ordered item with ordered sublist",
    input:  "# Item\n## Subitem",
    output: "<ol><li> Item<ol>\n<li> Subitem</li></ol></li></ol>"
  },
  {
    name:   "Ordered sublist without initial tag",
    input:  "## Sublist item",
    output: "<p>## Sublist item</p>"
  },
  {
    name:   "Unordered item with ordered sublist",
    input:  "* Item\n*# Subitem",
    output: "<ul><li> Item<ol>\n<li> Subitem</li></ol></li></ul>"
  },
  {
    name:   "Multiline unordered item",
    input:  "* Item\nstill continues",
    output: "<ul><li> Item\nstill continues</li></ul>"
  },
  {
    name:   "Multiline ordered item",
    input:  "# Item\nstill continues",
    output: "<ol><li> Item\nstill continues</li></ol>"
  },
  {
    name:   "Unordered list and paragraph",
    input:  "* Item\n\nParagraph",
    output: "<ul><li> Item</li>\n</ul><p>\nParagraph</p>"
  },
  {
    name:   "Ordered list and paragraph",
    input:  "# Item\n\nParagraph",
    output: "<ol><li> Item</li>\n</ol><p>\nParagraph</p>"
  },
  {
    name:   "Unordered list with leading whitespace",
    input:  " \t* Item",
    output: "<ul><li> Item</li></ul>"
  },
  {
    name:   "Ordered list with leading whitespace",
    input:  " \t# Item",
    output: "<ol><li> Item</li></ol>"
  },
  {
    name:   "Unordered list with bold item",
    input:  "* Item\n* **Bold item**",
    output: "<ul><li> Item</li>\n<li> <strong>Bold item</strong></li></ul>"
  },
  {
    name:   "Ordered list with bold item",
    input:  "# Item\n# **Bold item**",
    output: "<ol><li> Item</li>\n<li> <strong>Bold item</strong></li></ol>"
  },
  {
    name:   "Ordered list inside unordered list",
    input:  "* Item\n## Subitem",
    output: "<ul><li> Item<ol>\n<li> Subitem</li></ol></li></ul>"
  },
  {
    name:   "Horizontal rule",
    input:  "Some text\n----\nSome more text",
    output: "<p>Some text</p><hr /><p>Some more text</p>"
  },
  {
    name:   "Preformatted block",
    input:  "{{{\nPreformatted block\n}}}",
    output: "<pre>Preformatted block\n</pre>"
  },
  {
    name:   "Two preformatted blocks",
    input:  "{{{\nPreformatted block\n}}}\n{{{Block 2}}}",
    output: "<pre>Preformatted block\n</pre><p><tt>Block 2</tt></p>"
  },
  {
    name:   "Space escapes nowiki",
    input:  "{{{\nPreformatted block\n }}}\n}}}",
    output: "<pre>Preformatted block\n}}}\n</pre>"
  },
  {
    name:   "Inline nowiki with trailing braces",
    input:  "{{{foo}}}}}}",
    output: "<p><tt>foo}}}</tt></p>"
  },
  {
    name:   "h1",
    input:  "= Header =",
    output: "<h1>Header</h1>"
  },
  {
    name:   "h2",
    input:  "== Header =",
    output: "<h2>Header</h2>"
  },
  {
    name:   "h3",
    input:  "=== Header =",
    output: "<h3>Header</h3>"
  },
  {
    name:   "h4",
    input:  "==== Header =",
    output: "<h4>Header</h4>"
  },
  {
    name:   "h5",
    input:  "===== Header",
    output: "<h5>Header</h5>"
  },
  {
    name:   "h6",
    input:  "====== Header =",
    output: "<h6>Header</h6>"
  },
  {
    name:   "h1 (no spaces)",
    input:  "=Header=",
    output: "<h1>Header</h1>"
  },
  {
    name:   "h2 (no spaces)",
    input:  "==Header=",
    output: "<h2>Header</h2>"
  },
  {
    name:   "h3 (no spaces)",
    input:  "===Header=",
    output: "<h3>Header</h3>"
  },
  {
    name:   "h4 (no spaces)",
    input:  "====Header=",
    output: "<h4>Header</h4>"
  },
  {
    name:   "h5 (no spaces)",
    input:  "=====Header",
    output: "<h5>Header</h5>"
  },
  {
    name:   "h6 (no spaces)",
    input:  "======Header=",
    output: "<h6>Header</h6>"
  },
  {
    name:   "header-like",
    input:  "====\n",
    output: "<p>====\n</p>"
  },
  {
    name:   ">h6",
    input:  "======= Header =",
    output: "<p>======= Header =</p>"
  },
  {
    name:   "h1 ending with tilde",
    input:  "= Header ~",
    output: "<h1>Header ~</h1>"
  },
  {
    name:   "h2 ending with tilde",
    input:  "== Header ~",
    output: "<h2>Header ~</h2>"
  },
  {
    name:   "h3 ending with tilde",
    input:  "=== Header ~",
    output: "<h3>Header ~</h3>"
  },
  {
    name:   "h4 ending with tilde",
    input:  "==== Header ~",
    output: "<h4>Header ~</h4>"
  },
  {
    name:   "h5 ending with tilde",
    input:  "===== Header ~",
    output: "<h5>Header ~</h5>"
  },
  {
    name:   "h6 ending with tilde",
    input:  "====== Header ~",
    output: "<h6>Header ~</h6>"
  },
  {
    name:   "Tables",
    input:  "| A | B |\n| C | D |",
    output: "<table><tr><td> A </td><td> B </td></tr>" +
            "<tr><td> C </td><td> D </td></tr></table>"
  },
  {
    name:   "Tables without trailing pipe",
    input:  "| A | B\n| C | D",
    output: "<table><tr><td> A </td><td> B</td></tr>" +
            "<tr><td> C </td><td> D</td></tr></table>"
  },
  {
    name:   "Table headers",
    input:  "|= A | B |\n| C |= D |",
    output: "<table><tr><th> A </th><td> B </td></tr>" +
            "<tr><td> C </td><th> D </th></tr></table>"
  },
  {
    name:   "Table inline markup",
    input:  "| A | B |\n| //C// | **D** \\\\ E |",
    output: "<table><tr><td> A </td><td> B </td></tr>" +
            "<tr><td> <em>C</em> </td>" +
            "<td> <strong>D</strong> <br /> E </td></tr></table>"
  },
  {
    name:   "Escaped table inline markup",
    input:  "| A | B |\n| {{{//C//}}} | {{{**D** \\\\ E}}} |",
    output: "<table><tr><td> A </td><td> B </td></tr>" +
            "<tr><td> <tt>//C//</tt> </td>" +
            "<td> <tt>**D** \\\\ E</tt> </td></tr></table>"
  },
  {
    name:   "Raw URL",
    input:  "http://example.com/examplepage",
    output: "<p><a href=\"http://example.com/examplepage\">" +
            "http://example.com/examplepage</a></p>"
  },
  {
    name:   "Raw URL with tilde",
    input:  "http://example.com/~user",
    output: "<p><a href=\"http://example.com/~user\">" +
            "http://example.com/~user</a></p>"
  },
  {
    name:   "Unnamed URL",
    input:  "[[http://example.com/examplepage]]",
    output: "<p><a href=\"http://example.com/examplepage\">" +
            "http://example.com/examplepage</a></p>"
  },
  {
    name:   "Unnamed URL with tilde",
    input:  "[[http://example.com/~user]]",
    output: "<p><a href=\"http://example.com/~user\">" +
            "http://example.com/~user</a></p>"
  },
  {
    name:   "Named URL",
    input:  "[[http://example.com/examplepage|Example Page]]",
    output: "<p>" +
            "<a href=\"http://example.com/examplepage\">Example Page</a></p>"
  },
  {
    name:   "Unnamed link",
    input:  "[[MyPage]]",
    output: "<p><a href=\"/wiki/MyPage\">MyPage</a></p>"
  },
  {
    name:   "Named link",
    input:  "[[MyPage|My page]]",
    output: "<p><a href=\"/wiki/MyPage\">My page</a></p>"
  },
  {
    name:   "Unnamed interwiki link",
    input:  "[[WikiCreole:Creole1.0]]",
    output: "<p><a href=\"http://www.wikicreole.org/wiki/Creole1.0\">WikiCreole:Creole1.0</a></p>"
  },
  {
    name:   "Named interwiki link",
    input:  "[[WikiCreole:Creole1.0|Creole 1.0]]",
    output: "<p><a href=\"http://www.wikicreole.org/wiki/Creole1.0\">Creole 1.0</a></p>"
  },
  {
    name:   "Image",
    input:  "{{image.gif|my image}}",
    output: "<p><img alt=\"my image\" src=\"image.gif\"/></p>"
  },
  {
    name:   "Inline tt",
    input:  "Inline {{{tt}}} example {{{here}}}!",
    output: "<p>Inline <tt>tt</tt> example <tt>here</tt>!</p>"
  },
  {
    name:   "Strong",
    input:  "**Strong**",
    output: "<p><strong>Strong</strong></p>"
  },
  {
    name:   "Runaway strong #1",
    input:  "**Strong",
    output: "<p><strong>Strong</strong></p>"
  },
  {
    name:   "Runaway strong #2",
    input:  "** Strong *",
    output: "<p><strong> Strong *</strong></p>"
  },
  {
    name:   "Emphasis",
    input:  "//Emphasis//",
    output: "<p><em>Emphasis</em></p>"
  },
  {
    name:   "Runaway emphasis #1",
    input:  "//Emphasis",
    output: "<p><em>Emphasis</em></p>"
  },
  {
    name:   "Runaway emphasis #2",
    input:  "// Emphasis /",
    output: "<p><em> Emphasis /</em></p>"
  },
  {
    name:   "Multi-line emphasis",
    input:  "Bold and italics should //be\nable// to cross lines.\n\n" +
            "But, should //not be...\n\n...able// to cross paragraphs.",
    output: "<p>Bold and italics should <em>be\nable</em> to cross lines." +
            "\n</p>" + "<p>\nBut, should <em>not be...\n</em></p>" +
            "<p>\n...able<em> to cross paragraphs.</em></p>"
  },
  {
    name:   "URL/emphasis ambiguity",
    input:  "This is an //italic// text. This is a url: " +
            "http://www.wikicreole.org. This is what can go wrong://this " +
            "should be an italic text//.",
    output: "<p>This is an <em>italic</em> text. This is a url: " +
            "<a href=\"http://www.wikicreole.org\">" +
            "http://www.wikicreole.org</a>. This is what can go wrong:" +
            "<em>this should be an italic text</em>.</p>"
  },
  {
    name:   "Difficult emphasis #1",
    input:  "// http://www.link.org //",
    output: "<p><em> <a href=\"http://www.link.org\">" +
            "http://www.link.org</a> </em></p>"
  },
  {
    name:   "Difficult emphasis #2",
    input:  "// http //",
    output: "<p><em> http </em></p>"
  },
  {
    name:   "Difficult emphasis #3",
    input:  "// httphpthtpht //",
    output: "<p><em> httphpthtpht </em></p>"
  },
  {
    name:   "Difficult emphasis #4",
    input:  "// http: //",
    output: "<p><em> http: </em></p>"
  },
  {
    name:   "Difficult emphasis #5 (runaway)",
    input:  "// http://example.org",
    output: "<p><em> <a href=\"http://example.org\">http://example.org</a></em></p>"
  },
  {
    name:   "Difficult emphasis #6 (runaway)",
    input:  "// http://example.org//",
    output: "<p><em> <a href=\"http://example.org//\">http://example.org//</a></em></p>"
  },
  {
    name:   "Difficult emphasis #7",
    input:  "//httphpthtphtt//",
    output: "<p><em>httphpthtphtt</em></p>"
  },
  {
    name:   "Difficult emphasis #8",
    input:  "// ftp://www.link.org //",
    output: "<p><em> <a href=\"ftp://www.link.org\">" +
            "ftp://www.link.org</a> </em></p>"
  },
  {
    name:   "Difficult emphasis #9",
    input:  "// ftp //",
    output: "<p><em> ftp </em></p>"
  },
  {
    name:   "Difficult emphasis #10",
    input:  "// fttpfptftpft //",
    output: "<p><em> fttpfptftpft </em></p>"
  },
  {
    name:   "Difficult emphasis #11",
    input:  "// ftp: //",
    output: "<p><em> ftp: </em></p>"
  },
  {
    name:   "Difficult emphasis #12 (runaway)",
    input:  "// ftp://example.org",
    output: "<p><em> <a href=\"ftp://example.org\">ftp://example.org</a></em></p>"
  },
  {
    name:   "Difficult emphasis #13 (runaway)",
    input:  "//ftp://username:password@example.org/path//",
    output: "<p><em><a href=\"ftp://username:password@example.org/path//\">" +
            "ftp://username:password@example.org/path//</a></em></p>"
  },
  {
    name:   "Difficult emphasis #14",
    input:  "//fttpfptftpftt//",
    output: "<p><em>fttpfptftpftt</em></p>"
  },
  {
    name:   "Difficult emphasis #15",
    input:  "//ftp://username:password@link.org/path/",
    output: "<p><em><a href=\"ftp://username:password@link.org/path/\">" +
            "ftp://username:password@link.org/path/</a></em></p>"
  },
  {
    name:   "Escaped emphasis",
    input:  "~//Not emphasized~//",
    output: "<p><span class=\"escaped\">/</span>/Not emphasized<span class=\"escaped\">/</span>/</p>"
  },
  {
    name:   "Tilde escapes self",
    input:  "Tilde: ~~",
    output: "<p>Tilde: <span class=\"escaped\">~</span></p>"
  },
  {
    name:   "Escaped URL",
    input:  "~http://link.org",
    output: "<p><span class=\"escaped\">http://link.org</span></p>"
  },
  {
    name:   "Escaped strong ending",
    input:  "Plain ** bold ~** bold too",
    output: "<p>Plain <strong> bold <span class=\"escaped\">*</span>* bold too</strong></p>"
  },
  {
    name:   "Escaped emphasis ending",
    input:  "Plain // emphasized ~// emphasized too",
    output: "<p>Plain <em> emphasized <span class=\"escaped\">/</span>/ emphasized too</em></p>"
  },
  {
    name:   "Escaped h1 ending",
    input:  "= Header ~=",
    output: "<h1>Header <span class=\"escaped\">=</span></h1>"
  },
  {
    name:   "Escaped h2 ending",
    input:  "== Header ~==",
    output: "<h2>Header <span class=\"escaped\">=</span></h2>"
  },
  {
    name:   "Escaped h3 ending",
    input:  "=== Header ~===",
    output: "<h3>Header <span class=\"escaped\">=</span></h3>"
  },
  {
    name:   "Escaped h4 ending",
    input:  "==== Header ~====",
    output: "<h4>Header <span class=\"escaped\">=</span></h4>"
  },
  {
    name:   "Escaped h5 ending",
    input:  "===== Header ~=====",
    output: "<h5>Header <span class=\"escaped\">=</span></h5>"
  },
  {
    name:   "Escaped h6 ending",
    input:  "====== Header ~======",
    output: "<h6>Header <span class=\"escaped\">=</span></h6>"
  },
  {
    name:   "Escaped link ending #1",
    input:  "[[Link~]]]",
    output: "<p><a href=\"/wiki/Link]\">Link<span class=\"escaped\">]</span></a></p>"
  },
  {
    name:   "Escaped link ending #2",
    input:  "[[Link]~]]]",
    output: "<p><a href=\"/wiki/Link]]\">Link]<span class=\"escaped\">]</span></a></p>"
  },
  {
    name:   "Escaped link ending #3",
    input:  "[[Link~]]",
    output: "<p>[[Link<span class=\"escaped\">]</span>]</p>"
  },
  {
    name:   "Escaped link ending #4",
    input:  "[[Link|some text~]]]",
    output: "<p><a href=\"/wiki/Link\">some text<span class=\"escaped\">]</span></a></p>"
  },
  {
    name:   "Escaped link text separator #1",
    input:  "[[Link~|some text]]",
    output: "<p><a href=\"/wiki/Link|some text\">Link<span class=\"escaped\">|</span>some text</a></p>"
  },
  {
    name:   "Escaped link text separator #2",
    input:  "[[Link~||some text]]",
    output: "<p><a href=\"/wiki/Link|\">some text</a></p>"
  },
  {
    name:   "Escaped link text separator #3",
    input:  "[[Link|~|some text]]",
    output: "<p><a href=\"/wiki/Link\"><span class=\"escaped\">|</span>some text</a></p>"
  },
  {
    name:   "Escaped img ending #1",
    input:  "{{image.png|Alternative text~}}}",
    output: "<p><img alt=\"Alternative text}\" src=\"image.png\"/></p>"
  },
  {
    name:   "Escaped img ending #2",
    input:  "{{image.png|Alternative text}~}}}",
    output: "<p><img alt=\"Alternative text}}\" src=\"image.png\"/></p>"
  },
  {
    name:   "Escaped img ending #3",
    input:  "{{image.png|Alternative text~}}",
    output: "<p>{{image.png|Alternative text<span class=\"escaped\">}</span>}</p>"
  },
  {
    name:   "Escaped img ending #4",
    input:  "{{image.png|Alternative~}} text}}",
    output: "<p><img alt=\"Alternative}} text\" src=\"image.png\"/></p>"
  },
  {
    name:   "Image URI with tilde #1",
    input:  "{{image.png~|Alternative text}}",
    output: "<p><img alt=\"Alternative text\" src=\"image.png~\"/></p>"
  },
  {
    name:   "Image URI with tilde #2",
    input:  "{{image.png~||Alternative text}}",
    output: "<p><img alt=\"|Alternative text\" src=\"image.png~\"/></p>"
  },
  {
    name:   "Tables with escaped separator",
    input:  "| A | B |\n| C | D ~| E |",
    output: "<table><tr><td> A </td><td> B </td></tr>" +
            "<tr><td> C </td><td> D <span class=\"escaped\">|</span> E </td></tr></table>"
  },
  {
    name:   "Image in link",
    input:  "[[Link|Before {{image.png|Alternate}} After]]",
    output: "<p><a href=\"/wiki/Link\">Before <img alt=\"Alternate\" src=\"image.png\"/> After</a></p>"
  },
  {
    name:   "Formatting interwiki links with function",
    input:  "[[Palindrome:Creole]]",
    output: "<p><a href=\"http://www.example.com/wiki/eloerC\">Palindrome:Creole</a></p>"
  },
  {
    name:   "Preformatted block + CR",
    input:  "{{{\r\nsome text\r\nsome text\r\n}}}",
    output: "<pre>some text \r\nsome text \r\n</pre>",
    forIE:  true
  },
  {
    name:   "Block + CR",
    input:  "some text\r\nsome text\r\n",
    output: "<p>some text some text </p>",
    forIE:  true
  },
  {
    name:   "Named link in table",
    input:  "| [[MyLink|My link]] |",
    output: '<table><tr><td> <a href="/wiki/MyLink">My link</a> </td></tr></table>'
  },
  {
    name:   "Image in table",
    input:  "| {{image.png|Alternative text}} |",
    output: '<table><tr><td> <img alt="Alternative text" src="image.png"/> </td></tr></table>'
  },
  {
    name:   "Image in table (strict)",
    input:  "| {{image.png|Alternative text}} |",
    output: '<table><tr><td> {{image.png</td><td>Alternative text}} </td></tr></table>',
    options: { strict: true }
  },
  {
    name:   "Image in named link in table",
    input:  "| [[Link|{{image.png|Alternative text}}]] |",
    output: '<table><tr><td> <a href="/wiki/Link"><img alt="Alternative text" src="image.png"/></a> </td></tr></table>'
  },
  {
    name:   "Image without alternative text",
    input:  "{{image.png}}",
    output: '<p><img alt="" src="image.png"/></p>'
  },
  {
    name:   "Image without alternative text (strict)",
    input:  "{{image.png}}",
    output: '<p>{{image.png}}</p>',
    options: { strict: true }
  },
  {
    name:   "Image with empty alternative text",
    input:  "{{image.png|}}",
    output: '<p><img alt="" src="image.png"/></p>',
    options: { strict: true }
  },
  {
    name:   "Image with custom default alternative text",
    input:  "{{image.png}}",
    output: '<p><img alt="Image" src="image.png"/></p>',
    options: { defaultImageText: 'Image' }
  }
];
