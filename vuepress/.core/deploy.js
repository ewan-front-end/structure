const chalk = require('chalk')
const path = require("path")
const { DEPLOY } = require('./maps.js')
const { confirm } = require('../../../.utils/src/node/inquirer-prompt')
const { copySync, editJson } = require('../../../.utils/src/fs.js')
const fillStr = (str, len) => `${str}                                                  `.substr(0, len);

const W_TYPE = 10, W_FROM = 40, W_TO = 30
const ROOT = path.resolve(__dirname, '../../../..')
const ROOT_ABS = path.resolve(__dirname, '../../..')

function deploy() {
    const COPYS = [], SCRIPTS = []

    DEPLOY.forEach(item => {
        if (item.from && item.to) COPYS.push(item)
        if (item.type === 'SCRIPT') SCRIPTS.push(item)
    })

    COPYS.forEach(item => {
        const { from, to, desc } = item
        copySync(path.resolve(ROOT_ABS, from), path.resolve(ROOT, to))
        console.log(chalk.gray('部署 ' + from + ' 到 docs/') + chalk.white(to) + chalk.gray('  ' + desc))
    })

    if (SCRIPTS.length > 0) {
        editJson(path.join(process.cwd(), 'package.json'), pkg => {
            SCRIPTS.forEach(item => {
                pkg.scripts[item.key] = item.value
            })
        }, path => {
            console.log(chalk.gray('\n修改 ' + path))
            console.log(chalk.green('--------------------'))
            SCRIPTS.forEach(item => {
                console.log(chalk.green(item.key) + item.desc)
            })
            console.log(chalk.green('--------------------\n'))
        })
    }
}
function printDeployList(arr) {
    let scripts = ''
    arr.forEach(item => {
        const { type, from, to, key, value, file, dir, exclude, desc } = item
        let str = fillStr(type, W_TYPE)
        if (from && to) str += (fillStr(from, W_FROM) + fillStr(to, W_TO) + desc)
        if (type === 'SCRIPT') scripts += '  ' + key + '\n'
        if (type !== 'SCRIPT') console.log('  ' + chalk.gray(str));
    })
    if (scripts) {
        console.log(chalk.gray('package.json 中插入 scripts 如下命令：'))
        console.log(chalk.gray(scripts))
    }
}

console.log(chalk.gray('部署将有如下操作:'))
printDeployList(DEPLOY)
confirm('是否继续？', false).then(bl => {
    bl && deploy()
})