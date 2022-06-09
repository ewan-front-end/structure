const chalk = require('chalk')
const path = require("path")
const { DEPLOY_INIT } = require('./maps.js')
const { confirm } = require('../../.utils/src/node/inquirer-prompt')
const { copySync, editJson } = require('../../.utils/src/fs.js')
const ROOT_DOCS = path.resolve(__dirname, '../../..')
const ROOT_ABST = path.resolve(__dirname, '../..')
const fillStr = (str, len) => `${str}                                        `.substr(0, len);

const W_TYPE = 10, W_FROM = 40, W_TO = 30

console.log('部署动作有如下操作:')
console.log(chalk.gray(fillStr('DOWNLOAD', W_TYPE) + 'ewan-front-end/structure'))
console.log(chalk.gray(fillStr('DOWNLOAD', W_TYPE) + 'ewan-front-end/utils'))
printDeployList(DEPLOY_INIT)
confirm('是否继续？', false).then(bl => {
    bl && deploy()
})

function deploy() {
    const COPYS = [], SCRIPTS = []

    DEPLOY_INIT.forEach(item => {
        if (item.type === 'COPY') COPYS.push(item)
        if (item.type === 'SCRIPT') SCRIPTS.push(item)
    })

    COPYS.forEach(item => {
        const { from, to, desc } = item
        copySync(path.resolve(ROOT_ABST, from), path.resolve(ROOT_DOCS, to))
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
    arr.forEach(item => {
        const {type, from, to, key, value, file, dir, exclude, desc} = item
        let str = fillStr(type, W_TYPE)
        if (type === 'COPY' && from && to) {
            str += fillStr(from, W_FROM)
            str += fillStr(to, W_TO)
            str += desc
        }
        if (type === 'SCRIPT') {}
        console.log(chalk.gray(str));
    })
}






// require('child_process').exec(`node ${path.resolve(__dirname, '../.data/res-create.js')} index`, function (error, stdout, stderr) {
//     error && console.log(error)
//     stdout && console.log(stdout)
//     stderr && console.log(stderr)
// })