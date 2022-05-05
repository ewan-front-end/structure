const parseCustomBlock = require('./parseCustomBlock')

module.exports = (code, path) => {
    code = code.replace(/\{\{/g, `{TEMPLATE{`)
    code = code.replace(/\}\}/g, `}TEMPLATE}`)
    
    code = parseCustomBlock(code, path)
    
    return code
}