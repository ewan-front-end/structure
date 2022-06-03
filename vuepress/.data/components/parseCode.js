const parseCustomBlock = require('./parseCustomBlock')

module.exports = (code, path) => {
    const matchCustomBlock = code.match(/===\+[\s\S]+?===\-/g) || []
    matchCustomBlock.forEach(block => {
        code = code.replace(block, parseCustomBlock(block))
    })
    return code
}