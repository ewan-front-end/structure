const fs = require('fs')
const Path = require('path')
const chalk = require('chalk')
const { readFile, writeFile } = require('../.utils/src/fs.js')
const parseCustomBlock = require('../.data/components/parseCustomBlock')
const ARG_ARR = process.argv.slice(2)  // 命令参数

if (ARG_ARR.length > 0) {
    const arg = ARG_ARR[0]
    if (arg === 'DEPLOY') {
        const content = `
        demo
        `
        writeFile(Path.resolve(__dirname, '../.data/projects/demo.md'), content)
    }
    if (arg === 'DOCS') {
        const from = Path.resolve(__dirname, '../.data/projects')
        const files = fs.readdirSync(from)
        files.forEach((file, index) => {
            const to = Path.resolve(__dirname, '../doc-projects/', file)
            let content = readFile(Path.resolve(from, file))
            content = parseCustomBlock(content)
            writeFile(to, content, e => {
                console.log(chalk.gray(to))
            })
        })
    }
}