const fs = require('fs')
const chalk = require('chalk')
const path = require("path")
const root = path.resolve(__dirname, '..')

const { getStructure, getUtils } = require('./download.js')
const deployed = fs.existsSync(path.resolve(__dirname, 'guidance.js'))

const deployInit = () => {
    const { copySync } = require('../.utils/src/fs.js')
    const { DEPLOY_INIT } = require('../.structure/vuepress/maps.js')
    const { editJson } = require('../.utils/src/fs.js')
    const SCRIPTS = []

    DEPLOY_INIT.forEach(item => {
        if (item.type === 'COPY') {
            const { from, to, desc } = item
            copySync(path.resolve(root, from), path.resolve(root, to))
            console.log(chalk.gray('部署 docs/' + from + ' 到 docs/') + chalk.white(to) + chalk.gray('  ' + desc))
        }
        if (item.type === 'SCRIPT') SCRIPTS.push(item)
    })

    if (SCRIPTS.length === 0) return
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


if (deployed) {
    const { radio } = require('../.utils/src/node/inquirer-prompt')
    const { delDest, delDirExc } = require('../.utils/src/fs.js')
    const { UNDEPLOY } = require('../.structure/vuepress/maps.js')
    const { copySync } = require('../.utils/src/fs.js')
    radio('此项已部署过文档！', [{ value: 1, name: '引导重新部署' }, { value: 2, name: '清理并重新部署' }]).then(value => {
        if (value === 1) require('./guidance.js')
        if (value === 2) {
            const date = new Date()
            const hash = `${date.getFullYear()}${date.getMonth() + 1}${date.getDate()}-${date.getHours()}${date.getMinutes()}`
            copySync(path.resolve(__dirname, '..', '.data/data.js'), path.join(__dirname, `.beifen/${hash}-data.js`))
            copySync(path.resolve(__dirname, '..', '.data/md'), path.join(__dirname, `.beifen/${hash}-md`))

            UNDEPLOY.forEach(item => {
                if (item.type === 'DEL') {
                    const { file, dir, exclude } = item
                    if (file) {
                        let dest = path.resolve(root, file)
                        delDest(dest)
                        console.log(chalk.gray('删除 docs/' + file))
                    } else {
                        let dest = path.resolve(root, dir)
                        delDirExc(dest, exclude)
                    }
                }
            })
            delDest(path.resolve(__dirname, '../.structure'))
            delDest(path.resolve(__dirname, '../.utils'))
            delDest(path.resolve(__dirname, '../.data'))
            console.log('\n')
            console.log('.data/md      已备份到 .deploy/.benfen/md')
            console.log('.data/data.js 已备份到 .deploy/.benfen/data.js')
            console.log('\n')
            console.log(chalk.green('全新部署：npm run deploy'))
            console.log('\n')
        }
    })
} else {
    Promise.all([getStructure(), getUtils()]).then(arr => {
        deployInit()
    })
}

// require('child_process').exec(`node ${path.resolve(__dirname, '../.data/res-create.js')} index`, function (error, stdout, stderr) {
//     error && console.log(error)
//     stdout && console.log(stdout)
//     stderr && console.log(stderr)
// })