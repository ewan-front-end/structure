const Path = require('path')
const chalk = require('chalk')
const { writeFile, readFile } = require('../../.utils/fs.js')

module.exports = (path, node) => {
    let {src, children} = node
    let content = readFile(Path.resolve(__dirname, '../md/'+src+'.md'))
    let childStr = ''
    for (i in children) {
        let child = children[i], title = child.title || child.linkName || i
        childStr += `- [︳${title}](/${i})\n`
    }
    content = `---\nsidebar: false\n---\n\n<div class="root-children brick-wall">\n\n${childStr}\n</div>\n\n## 文档地图\n` + content
    writeFile(path + '.md', content, path => {
        console.log(chalk.gray('创建 ' + path + '\n'))
    })
}
