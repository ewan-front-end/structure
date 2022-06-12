const Path = require("path")
const chalk = require('chalk')
const { writeFile } = require('../../.utils/src/fs.js')

let hasNewAnchor = false, LINKS
try {
    LINKS = require('../../.LINKS.json')
} catch (e) {
    LINKS = {}
}

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
    if (hasNewAnchor) {
        writeFile(Path.resolve(__dirname, '../../.LINKS.json'), LINKS, path => {
            console.log(chalk.gray('创建 ' + path))
        })
    }

    /**
     * 链接引用
     * 格式：[LINK ID:NEW_TITLE]
     * 例子：[LINK MySQL_install] 或 [LINK MySQL_install:重命名]
     */
    function createAnchor(ALL, KEY, anchor, TIT) {
        if (anchor) {
            const isSelf = anchor.path === path
            const pathname = /\/$/m.test(anchor.path) ? anchor.path : anchor.path + '.html'
            const href = isSelf ? `#${KEY}` : `${pathname}#${KEY}`
            const title = TIT || anchor.title
            const content = isSelf ? `<a href="${href}">${title}</a>` : `<a href="${href}" target="_blank">${title}</a>`
            code = code.replace(ALL, content)
        } else {
            code = code.replace(ALL, `锚点[${KEY}]不存在`)
        }
    }
    while (/(\[LINK\s([^#:\n\r]+)\])/.exec(code) !== null) { createAnchor(RegExp.$1, RegExp.$2, LINKS[RegExp.$2], null) }
    while (/(\[LINK\s([^#:\n\r]+):([^#:\n\r]+)\])/.exec(code) !== null) { createAnchor(RegExp.$1, RegExp.$2, LINKS[RegExp.$2], RegExp.$3) }

    return code
}