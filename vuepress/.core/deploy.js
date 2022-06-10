const chalk = require('chalk')
const path = require("path")
const { DEPLOY, SCRIPTS } = require('./maps.js')
const { confirm } = require('../../../.utils/src/node/inquirer-prompt')
const { copySync, editJson } = require('../../../.utils/src/fs.js')
const fillStr = (str, len) => `${str}                                                  `.substr(0, len);

const W_TYPE = 10, W_FROM = 40, W_TO = 30
const ROOT = path.resolve(__dirname, '../../../..')
const ROOT_ABS = path.resolve(__dirname, '../../..')

function deploy() {
    DEPLOY.forEach(({ from, to, desc }) => {
        copySync(path.resolve(ROOT_ABS, from), path.resolve(ROOT, to))
        console.log(chalk.gray('部署 ' + fillStr(from, W_FROM) + ' 到 docs/' + fillStr(to, W_TO) + desc))
    })
    console.log('\n');
    if (SCRIPTS.length > 0) {
        editJson(path.join(process.cwd(), 'package.json'), pkg => {
            SCRIPTS.forEach(({key, value}) => {pkg.scripts[key] = value})
        }, path => {
            console.log(chalk.gray('在package.json的scripts属性中插入如下命令：'))
            SCRIPTS.forEach(({key, desc}) => {console.log(chalk.gray('  ' + fillStr(key, 20) + desc))})
            console.log('\n')
        })
    }
}

console.log(chalk.gray('部署将有如下操作:'))
DEPLOY.forEach(({ type, from, to, desc }) => {
    console.log(chalk.gray('  ' + fillStr(type, W_TYPE) + fillStr(from, W_FROM) + fillStr(to, W_TO) + desc))
})
console.log('\n');
SCRIPTS.length > 0 && console.log(chalk.gray('在package.json的scripts属性中插入如下命令：\n  ' + SCRIPTS.map(e => e.key).join('\n  ')))
console.log('\n');
confirm('是否继续？', false).then(bl => {
    bl && deploy()
})
