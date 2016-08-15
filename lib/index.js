const retext = require('retext')()
const nodefn = require('when/node')
const {modifyNodes} = require('reshape-plugin-util')

module.exports = function reshapeRetext (plugins) {
  Array.prototype.concat(plugins).map((plugin) => {
    Array.isArray(plugin)
      ? retext.use.apply(retext, plugin)
      : retext.use(plugin)
  })

  return function retextPlugin (tree) {
    return modifyNodes(tree, (node) => {
      return (node.type === 'text' && !/^\n\s*$/.test(node))
    }, (node) => {
      return nodefn.call(retext.process.bind(retext), node.content)
        .then((res) => {
          node.content = res.contents
          return node
        })
    })
  }
}
