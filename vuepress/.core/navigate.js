const fs = require('fs')
const Path = require('path')
const chalk = require('chalk')
const { writeFile } = require('../.utils/src/fs.js')
const { iterateItem } = require('./utils')
const { SCRIPTS_NAVIGATION_G } = require('./maps')
const ARG_ARR = process.argv.slice(2)  // 命令参数

if (ARG_ARR.length > 0) {
  // todo:文件夹名限制
  const type = ARG_ARR[0]
  const deployed = fs.existsSync(Path.resolve(__dirname, '../' + type))

  if (deployed) {
    console.log(chalk.red(`项目描述已部署: docs/.abstract/${type}/\n`))
    iterateItem({ title: '扩展导航', children: SCRIPTS_NAVIGATION_G }, 0)
    console.log('\n')
  } else {
    const content = `demo`
    writeFile(Path.resolve(__dirname, '../projects/demo.md'), content, e => {
      console.log(chalk.green(`项目描述已部署: docs/.abstract/${type}/\n`))
      iterateItem({ title: '扩展导航', children: SCRIPTS_NAVIGATION_G }, 0)
      console.log('\n')
    })
  }
}

