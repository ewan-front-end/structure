const path = require("path")
const chalk = require('chalk')
const { copySync, editJson } = require('../.utils/src/fs.js')
const { DEPLOY_THEME } = require('../.structure/vuepress/deploy.js')
const CWD = process.cwd();

console.log('\n');
DEPLOY_THEME.forEach(res => {
    let from = path.join(CWD, res[0].trim()), to = path.join(CWD, res[1].trim())
    copySync(from, to)
    console.log(chalk.gray('部署 ' + res[0] + ' 到 ') + chalk.white(res[1]) + chalk.gray('  ' + res[2]))
})

editJson(path.join(CWD, 'package.json'), pkg => {
    pkg.scripts['update:assets'] = 'node .deploy/update-assets.js'
})
console.log(chalk.green('\n--------------------'))
console.log(chalk.green('npm run update:assets') + '  更新站点资源')
console.log(chalk.green('--------------------\n'))

console.log(chalk.gray(`默认主题结构
├── global-components           该目录下的组件都会被自动注册为全局组件
│   └── xxx.vue
├── components                  普通Vue组件
│   └── xxx.vue
├── layouts                     布局组件
│   ├── Layout.vue              所有的页面会将此组件作为默认布局
│   ├── 404.vue                 匹配不到的路由
│   ├── AnotherLayout.vue       如有其它布局的需求: 1.创建此文件  2.在有此需求的.md文件顶部标识为 ---回车layout: AnotherLayout回车
│   └── GlobalLayout.vue        如想设置全局的UI如<header> #使用全局布局组件
├── styles                      全局的样式和调色板
│   ├── index.styl
│   └── palette.styl
├── templates                   修改默认的模板文件
│   ├── dev.html
│   └── ssr.html
├── index.js                    主题文件的入口文件 如缺失 需要将package.json中的"main"字段设置为layouts/Layout.vue
├── enhanceApp.js               主题水平的客户端增强文件
└── package.json\n`))