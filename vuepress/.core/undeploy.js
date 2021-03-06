const chalk = require('chalk')
const path = require("path")
const { BACKUPS, INSTALL, UNINSTALL } = require('./maps.js')
const { confirm } = require('../.utils/src/node/inquirer-prompt')
const { copySync, delDest } = require('../.utils/src/fs.js')
const fillStr = (str, len) => `${str}                                                  `.substr(0, len);

const W_TO = 30
const ROOT = path.resolve(__dirname, '../..')
const ROOT_ABS = path.resolve(__dirname, '..')

function undeploy() {
    BACKUPS.forEach(({ to }) => {
        const arr = to.split('/'), name = arr[arr.length - 1], dest = path.resolve(ROOT_ABS, '.backups', name)
        copySync(path.resolve(ROOT, to), dest)
        console.log(chalk.gray('备份 ' + fillStr(to, W_TO) + '到 .abstract/.backups/'))
    })
    INSTALL.forEach(({ to }) => {
        delDest(path.resolve(ROOT, to))
        console.log(chalk.gray('删除 docs/' + to))
    })
    UNINSTALL.forEach(e => {
        delDest(path.resolve(ROOT, e))
        console.log(chalk.gray('删除 ' + e))
    })
    console.log('\n')
}

console.log(chalk.gray('卸载将有如下操作:'))
BACKUPS.forEach(({ to }) => {console.log(chalk.gray('  备份 ' + fillStr(to, W_TO) + + '到 .abstract/.backups/'))})
INSTALL.forEach(({ to }) => {console.log(chalk.gray('  删除 ' + to))})
UNINSTALL.forEach(e => {console.log(chalk.gray('  删除 ' + e))})
console.log('\n')
confirm('是否继续？', false).then(bl => {
    bl && undeploy()
})