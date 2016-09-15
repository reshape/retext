const retext = require('retext')()
const when = require('when')
const nodefn = require('when/node')
const {modifyNodes} = require('reshape-plugin-util')

const blacklist = ['script', 'style', 'pre', 'code']

module.exports = function reshapeRetext (plugins) {
  Array.prototype.concat(plugins).map((plugin) => {
    Array.isArray(plugin)
      ? retext.use.apply(retext, plugin)
      : retext.use(plugin)
  })

  return function retextPlugin (tree) {
    return modifyNodes(tree, (node) => node.type === 'tag', (node) => {
      // if node has skip property, remove it and move on
      if (node.attrs && node.attrs['retext-skip']) {
        delete node.attrs['retext-skip']
        return node
      }
      // if it's a blacklisted tag, move on
      if (blacklist.indexOf(node.name) > -1) return node
      // if it has no content, move on
      if (!node.content) return node

      // otherwise, run through its content
      return when.map(node.content, (n) => {
        // if its not a text node, or is only whitespace, move on
        if (n.type !== 'text') return n
        if (/^\n\s*$/.test(n.content)) return n

        // otherwise, process it with retext
        return nodefn.call(retext.process.bind(retext), n.content)
          .then((res) => {
            n.content = res.contents
            return n
          })
      }).then((contents) => {
        node.content = contents
        return node
      })
    })
  }
}
