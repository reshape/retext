let retext = require('retext')()
const W = require('when')

module.exports = (plugins) => {
  plugins.map((plugin) => {
    Array.isArray(plugin)
      ? retext.use.apply(retext, plugin)
      : retext.use(plugin)
  })

  const contentNodes = []
  const tasks = []

  return function reshapeRetext (tree) {
    // go through the tree and get all text nodes
    tree.map((node) => {
      // bottom up recurse
      if (node.type === 'tag' && node.content) {
        reshapeRetext(node.content)
      }

      // process content for any text node
      if (node.type === 'text' && !/^\n\s*$/.test(node)) {
        if (node.content.match(/[^\s]/)) {
          contentNodes.push(node)
          tasks.push(retext.process(node.content))
        }
      }
    })

    // resolve all the promises, set to contents
    return W.map(tasks, (content, i) => {
      contentNodes[i].content = content.toString()
    }).then(() => tree)
  }
}
