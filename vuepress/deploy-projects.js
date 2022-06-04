const fs = require('fs')
const Path = require('path')
const chalk = require('chalk')
const { readFile, writeFile } = require('../.utils/src/fs.js')
const parseCustomBlock = require('../.data/components/parseCustomBlock')
const ARG_ARR = process.argv.slice(2)  // 命令参数
const dirFrom = Path.resolve(__dirname, '../.data/projects')
const dirTo = Path.resolve(__dirname, '../projects')

const handleContent = (filename) => {
    const pathTo = Path.resolve(dirTo, filename)
    const name = filename.replace('.md', '')
    let info = {}
    let content = readFile(Path.resolve(dirFrom, filename));
    if (/(^\{[^\}]+\})/.exec(content) !== null) {
        info = JSON.parse(RegExp.$1)
        let infoHtml = ''
        info.title && (infoHtml += `############ ${info.title}`)
        content = content.replace(RegExp.$1, infoHtml)
    }
    content = parseCustomBlock(content)
    writeFile(pathTo, `<pre class="code-block">${content}</pre>`, e => {
        console.log(chalk.gray(pathTo))
    })
    return `- [${info.title || name}](${name})\n`
}
const createDocs = (dest) => {
    if (dest) {
        if (!dest.includes('.md')) dest += '.md'
        handleContent(dest)
    } else {
        const files = fs.readdirSync(dirFrom)
        const readmePath = Path.resolve(dirTo, 'README.md')
        let linkHtml = ''
        files.forEach(filename => {
            linkHtml += handleContent(filename)
        })
        writeFile(readmePath, linkHtml, e => {
            console.log(chalk.gray(readmePath))
        })
    }
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
        ARG_ARR.length > 1 ? createDocs(ARG_ARR[1]) : createDocs()
    }
}