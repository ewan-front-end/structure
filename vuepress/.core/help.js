const chalk = require('chalk')
const { HELP } = require('./maps.js')
const { iterateList } = require('./utils')
iterateList(HELP, 0)

const table =
    `
┌──────────┬───────────────────────────┬───────────────────────────┬────────────────────────────┐
│   类型               位置                         相关操作                    说明
│ DOCS       docs/
│ DATA       docs/.abstract/data.js      data:watch                   监听位置文件
│                                        data:build [/tools]          把DATA指向的RES构建到DOCS
│ RES        docs/.abstract/md           res:watch                    监听位置目标
│                                        res:build [demo]             构建RES到DOCS
│ PREJECTS   docs/.abstract/projects     projects:deploy 
│                                        projects:build [demo.md]
└──────────┴───────────────────────────┴───────────────────────────┴────────────────────────────┘`
console.log(chalk.gray(table) + '\n')

const firstTimeUseText = `
第一次使用：
    比如第一次克隆到本地
    1. sudo npm i concurrently -g
    2. npm run data:build
    3. npm run projects:build
`
console.log(chalk.gray(firstTimeUseText) + '\n')