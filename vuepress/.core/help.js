const chalk = require('chalk')
const { HELP } = require('./maps.js')
const { iterateList } = require('./utils')
iterateList(HELP, 0)

const table =
    `┌──────────┬───────────────────────────┬───────────────────────────┬────────────────────────────┐
│   类型               位置                         相关操作                    说明
│ DOCS       docs/                                                    文档输出位置
│ DATA       docs/.abstract/data.js      data:watch                   数据监听目标
│                                        data:build [/tools]          把数据指向的RES构建到DOCS
│ RES        docs/.abstract/md           res:watch                    资源监听目标
│                                        res:build [demo]             构建资源到DOCS
│ PREJECTS   docs/.abstract/projects     projects:deploy              项目监听目标
│                                        projects:build [demo.md]     构建项目到DOCS
└──────────┴───────────────────────────┴───────────────────────────┴────────────────────────────┘`
console.log(chalk.gray(table) + '\n')

const firstTimeUseText = `
第一次使用：
    比如第一次克隆到本地
    1. sudo npm i concurrently -g
    2. npm run data:build
`
console.log(chalk.gray(firstTimeUseText) + '\n')
