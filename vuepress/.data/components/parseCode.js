const parseCustomBlock = require('./parseCustomBlock')
const {CUSTOM_BLOCK_CUSTOM_CHAR} = require('../../.config.js')

module.exports = (code, path) => {
    code = code.replace(/\{\{/g, `{TEMPLATE{`)
    code = code.replace(/\}\}/g, `}TEMPLATE}`)
    
    code = parseCustomBlock(code, path)

    // todo:更精确在CUSTOM_BLOCK中替换
    CUSTOM_BLOCK_CUSTOM_CHAR.forEach(e => {
        const key = Object.keys(e)[0], val = Object.values(e)[0], reg = new RegExp(key, 'g')
        code = code.replace(reg, val)
    })
    
    return code
}