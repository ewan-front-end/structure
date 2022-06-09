const fs = require('fs')
const chalk = require('chalk')
const path = require("path")
const { DEPLOY_INIT } = require('./maps.js')
const { confirm } = require('../../.utils/src/node/inquirer-prompt')
const { copySync, editJson } = require('../../.utils/src/fs.js')
const root = path.resolve(__dirname, '../..')
const COPYS = [], SCRIPTS = []

const fillStr = (str, len) => `${str}                                        `.substr(0, len)
function printDeployList(arr) {
    arr.forEach(item => {
        const {type, from, to, key, value, file, dir, exclude, desc} = item
        let str = chalk.gray(fillStr(type, 10))
        if (type === 'COPY' && from && to) {
            str += chalk.gray(fillStr(from, 40))
            str += chalk.gray(fillStr(to, 30))
            str += chalk.gray(desc)
        }
        if (type === 'SCRIPT') {}
        console.log(str);
    })
}

printDeployList(DEPLOY_INIT)
confirm('是否继续？', false).then(bl => {
    bl && deploy()
})

function deploy() {
    DEPLOY_INIT.forEach(item => {
        if (item.type === 'COPY') COPYS.push(item)
        if (item.type === 'SCRIPT') SCRIPTS.push(item)
    })

    COPYS.forEach(item => {
        const { from, to, desc } = item
        copySync(path.resolve(root, from), path.resolve(root, to))
        console.log(chalk.gray('部署 docs/' + from + ' 到 docs/') + chalk.white(to) + chalk.gray('  ' + desc))
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






// require('child_process').exec(`node ${path.resolve(__dirname, '../.data/res-create.js')} index`, function (error, stdout, stderr) {
//     error && console.log(error)
//     stdout && console.log(stdout)
//     stderr && console.log(stderr)
// })