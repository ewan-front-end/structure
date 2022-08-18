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
     * 格式：[LINK[字号] TITLE#ID]
     * 例子：[LINK MySQL安装#MySQL_install] 或 [LINK2 MySQL安装#MySQL_install]
     */
    while (/(\[LINK([0-9]?)\s(.+?)#([\w-]+?)\])/.exec(code) !== null) {
        LINKS[RegExp.$4] = { path, title: RegExp.$3 }
        let className = 'anchor'
        if (RegExp.$2) className += ' anchor' + RegExp.$2
        code = code.replace(RegExp.$1, `<a id="${RegExp.$4}" class="${className}"><i class="img"><img :src="$withBase('/images/anchor4.png')"></i><span>${RegExp.$3}</span><span>#${RegExp.$4}</span></a>`)
        hasNewAnchor = true
    }
    if (hasNewAnchor) {
        writeFile(Path.resolve(__dirname, '../../.LINKS.json'), LINKS, path => {
            console.log(chalk.gray('创建 ' + path))
        })
    }

    /**
     * 链接引用
     * 格式：[LINK[字号] ID:NEW_TITLE]
     * 例子：[LINK MySQL_install] 或 [LINK MySQL_install:重命名] 或 [LINK1 MySQL_install]
     */
    function createAnchor(ALL, KEY, anchor, TIT, SIZE) {
        if (anchor) {
            const isSelf = anchor.path === path
            const pathname = /\/$/m.test(anchor.path) ? anchor.path : anchor.path + '.html'
            const href = isSelf ? `#${KEY}` : `${pathname}#${KEY}`
            const title = TIT || anchor.title
            const className = SIZE ? ' class="sz' + SIZE + '"' : ''
            const content = isSelf ? `<a href="${href}"${className}>${title}</a>` : `<a href="${href}" target="_blank"${className}>${title}</a>`
            code = code.replace(ALL, content)
        } else {
            code = code.replace(ALL, `锚点[${KEY}]不存在`)
        }
    }
    while (/(\[LINK([0-9]?)\s([^#:\n\r]+)\])/.exec(code) !== null) { createAnchor(RegExp.$1, RegExp.$3, LINKS[RegExp.$3], null, RegExp.$2) }
    while (/(\[LINK([0-9]?)\s([^#:\n\r]+):([^#:\n\r]+)\])/.exec(code) !== null) { createAnchor(RegExp.$1, RegExp.$3, LINKS[RegExp.$3], RegExp.$4, RegExp.$2) }

    return code
}