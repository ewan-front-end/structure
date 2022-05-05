const path = require("path")
const chalk = require('chalk')
const argv = process.argv.slice(2)
const { checkbox } = require('../.utils/src/node/inquirer-prompt')
const { copySync } = require('../.utils/src/fs.js')
const TYPES = require('../.structure/vuepress/maps.js')

const update = (type) => {
    const options = []
    const list = TYPES[type]

    list.forEach((item, value) => {
        options.push({
            value,
            name: item[2] + ' ' + item[1]
        })
    })
    checkbox('请勾选要更新的选项:', options).then(arr => {
        console.log('\n')
        arr.forEach(i => {
            let item = list[i]
            let from = path.resolve(__dirname, '..', item[0].trim()), to = path.resolve(__dirname, '..', item[1].trim())
            copySync(from, to)
            console.log(chalk.gray('更新 ' + item[0] + ' 到 ') + chalk.white(item[1]) + chalk.gray('  ' + item[2]))
        })
        console.log('\n')
    })
}

if (argv.length > 0) {
    update(argv[0])
}
