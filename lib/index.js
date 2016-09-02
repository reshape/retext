const retext = require('retext')()
const when = require('when')
const nodefn = require('when/node')
const {modifyNodes} = require('reshape-plugin-util')

module.exports = function reshapeRetext (plugins) {
  Array.prototype.concat(plugins).map((plugin) => {
    Array.isArray(plugin)
      ? retext.use.apply(retext, plugin)
      : retext.use(plugin)
  })

  return function retextPlugin (tree) {
    // const {inspect} = require('util')
    // console.log(inspect(tree, { depth: null, showHidden: true }))
    return modifyNodes(tree, (node) => node.type === 'tag', (node) => {
      if (node.attrs && node.attrs['retext-skip']) {
        delete node.attrs['retext-skip']
        return node
      }
      if (!node.content) return node

      return when.map(node.content, (n) => {
        if (n.type !== 'text') return n
        if (/^\n\s*$/.test(n.content)) return n
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
