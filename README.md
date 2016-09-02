# Reshape Retext

[![npm](https://img.shields.io/npm/v/reshape-retext.svg?style=flat-square)](https://npmjs.com/package/reshape-retext)
[![tests](https://img.shields.io/travis/reshape/retext.svg?style=flat-square)](https://travis-ci.org/reshape/retext?branch=master)
[![dependencies](https://img.shields.io/david/reshape/retext.svg?style=flat-square)](https://david-dm.org/reshape/retext)
[![coverage](https://img.shields.io/coveralls/reshape/retext.svg?style=flat-square)](https://coveralls.io/r/reshape/retext?branch=master)

Plugin wrapper over [Retext](https://github.com/wooorm/retext), an extensible system for analyzing and manipulating natural language.

## Usage

```js
const fs = require('fs')
const reshape = require('reshape')
const retext = require('reshape-retext')
const emoji = require('retext-emoji')
const smartypants = require('retext-smartypants')

reshape({
  plugins: retext([[emoji, { convert: 'encode' }], smartypants])
}).process(fs.readFileSync('path/to/file.html', 'utf8'))
  .then((result) => { fs.writeFileSync('path/to/file.html', 'utf8') })
```

#### Input html

```html
<html>
<body>
  <article class="my-article">
    <h1>Hello "world"...</h1>
    <p>The three wise monkeys [. . .] sometimes called the three mystic
    apes--are a pictorial maxim. Together they embody the proverbial
    principle to ("see no evil, hear no evil, speak no evil"). The
    three monkeys are Mizaru (:see_no_evil:), covering his eyes, who
    sees no evil; Kikazaru (:hear_no_evil:), covering his ears, who
    hears no evil; and Iwazaru (:speak_no_evil:), covering his mouth,
    who speaks no evil.</p>
  </article>
</body>
</html>
```

#### Output html

```html
<html>
<body>
  <article class="my-article">
    <h1>Hello “world”…</h1>
    <p>The three wise monkeys […] sometimes called the three mystic
    apes—are a pictorial maxim. Together they embody the proverbial
    principle to (“see no evil, hear no evil, speak no evil”). The
    three monkeys are Mizaru (🙈), covering his eyes, who
    sees no evil; Kikazaru (🙉), covering his ears, who
    hears no evil; and Iwazaru (🙊), covering his mouth,
    who speaks no evil.</p>
  </article>
</body>
</html>
```

## Skipping Tags

If you'd like to have retext skip processing any any particular tag, you can add a `retext-skip` attribute to the tag. The plugin will not process the tag's contents, but will remove the attribute in the output. For example, the following input:

```html
<p>:tada:</p>
<p retext-skip>:tada:</p>
```

...would produce this output:

```html
<p>🎉</p>
<p>:tada:</p>
```

## License & Contributing

- Licensed under [MIT](LICENSE.md)
- See our [contributing guide](contributing.md)
