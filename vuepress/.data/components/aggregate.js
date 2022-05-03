const Path = require("path")
const chalk = require('chalk')
const { writeFile } = require('../../.utils/fs.js')
const LINKS = require('../.LINKS.json') || {}
let hasNewAnchor = false

module.exports = (code, path) => {
    /**
     * 链接锚点
     * 格式：[LINK TITLE#ID]
     * 例子：[LINK MySQL安装#MySQL_install]
     */
    while (/(\[LINK\s(.+?)#([\w-]+?)\])/.exec(code) !== null) {
        LINKS[RegExp.$3] = { path, title: RegExp.$2 }
        code = code.replace(RegExp.$1, `<a id="${RegExp.$3}" class="anchor"><img :src="$withBase('/images/anchor4.png')"><span>${RegExp.$2}</span><span>#${RegExp.$3}</span></a>`)
        hasNewAnchor = true
    }
    if (hasNewAnchor) writeFile(Path.resolve(__dirname, '../.LINKS.json'), LINKS, path => {
        console.log(chalk.gray('创建 ' + path))
    })

    /**
     * 链接引用
     * 格式：[LINK ID:NEW_TITLE]
     * 例子：[LINK MySQL_install] 或 [LINK MySQL_install:重命名]
     */
    while (/(\[LINK\s([^#:\n\r]+?):?([^#:\n\r]*?)\])/.exec(code) !== null) {
        const anchor = LINKS[RegExp.$2]
        if (anchor) {
            const pathname = anchor.path.match(/\/$/m) ? anchor.path : anchor.path + '.html'
            const href = anchor.path === path ? `#${RegExp.$2}` : `${pathname}#${RegExp.$2}`
            const title = RegExp.$3 || anchor.title
            code = code.replace(RegExp.$1, `<a href="${href}" target="_blank">${title}</a>`)
        } else {
            code = code.replace(RegExp.$1, `锚点[${RegExp.$2}]不存在`)
        }
    }

    return code
}