const fs = require('fs')
const Path = require('path')
const chalk = require('chalk')
const { writeFile } = require('../.utils/src/fs.js')
const { iterateItem } = require('./utils')
const { HELP_SCRIPTS } = require('./maps')

const deployed = fs.existsSync(Path.resolve(__dirname, '../projects'))

if (deployed) {
    console.log(chalk.red('项目描述已部署: docs/.abstract/projects/\n'))
    iterateItem(HELP_SCRIPTS[2], 0, ['projects:deploy'])
    console.log('\n')
} else {
    const content = `demo`
    writeFile(Path.resolve(__dirname, '../projects/demo.md'), content, e => {
        console.log(chalk.green('项目描述已部署: docs/.abstract/projects/\n'))
        iterateItem(HELP_SCRIPTS[2], 0, ['projects:deploy'])
        console.log('\n')
    })
}