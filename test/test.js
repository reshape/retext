const retext = require('..')
const reshape = require('reshape')
const {readFileSync} = require('fs')
const test = require('ava')
const path = require('path')
const fixtures = path.join(__dirname, 'fixtures')
const emoji = require('retext-emoji')
const smartypants = require('retext-smartypants')

test('basic', (t) => {
  return compare(t, 'basic', [[emoji, { convert: 'encode' }], smartypants])
})

function compare (t, name, plugins) {
  const inputFile = path.join(fixtures, `${name}.html`)
  const input = readFileSync(inputFile, 'utf8')
  const expected = readFileSync(path.join(fixtures, `${name}.expected.html`), 'utf8')

  return reshape({ plugins: retext(plugins), filename: inputFile })
    .process(input)
    .then((res) => t.truthy(res.output() === expected))
}
