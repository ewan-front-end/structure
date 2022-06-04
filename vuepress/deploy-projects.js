const fs = require('fs')
const Path = require('path')
const chalk = require('chalk')
const { readFile, writeFile } = require('../.utils/src/fs.js')
const parseCustomBlock = require('../.data/components/parseCustomBlock')
const ARG_ARR = process.argv.slice(2)  // 命令参数

const createDocs = () => {
    const from = Path.resolve(__dirname, '../.data/projects')
    const files = fs.readdirSync(from)
    const docsDir = Path.resolve(__dirname, '../doc-projects')
    const indexPath = Path.resolve(docsDir, 'README.md')
    let fileLinkStr = ''
    files.forEach((file, index) => {
        const to = Path.resolve(docsDir, file)
        const name = file.replace('.md', '')
        let info = {}
        let content = readFile(Path.resolve(from, file));
        if (/(^\{[^\}]+\})/.exec(content) !== null) {
            info = JSON.parse(RegExp.$1)
            let infoHtml = ''
            info.title && (infoHtml += `############ ${info.title}`)
            content = content.replace(RegExp.$1, infoHtml)
        }
        fileLinkStr += `- [${info.title || name}](${name})\n`
        content = parseCustomBlock(content)
        writeFile(to, `<pre class="code-block">${content}</pre>`, e => {
            console.log(chalk.gray(to))
        })
    })
    writeFile(indexPath, fileLinkStr, e => {
        console.log(chalk.gray(indexPath))
    })
}

if (ARG_ARR.length > 0) {
    const arg = ARG_ARR[0]
    if (arg === 'DEPLOY') {
        const content = `
        demo
        `
        writeFile(Path.resolve(__dirname, '../.data/projects/demo.md'), content)
    }
    if (arg === 'DOCS') {
        createDocs()
    }
}