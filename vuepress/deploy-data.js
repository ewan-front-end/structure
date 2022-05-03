const chalk = require('chalk')
const path = require("path")
const { copySync, editJson } = require('../.utils/src/fs.js')
const { DEPLOY_DATA } = require('../.structure/vuepress/deploy.js')
const CWD = process.cwd();

DEPLOY_DATA.forEach(res => {
    let from = path.join(CWD, res[0].trim()), to = path.join(CWD, res[1].trim())
    copySync(from, to)
    console.log(chalk.gray('部署 ' + res[0] + ' 到 ') + chalk.white(res[1]) + chalk.gray('  ' + res[2]))
})

editJson(path.join(CWD, 'package.json'), pkg => {
    pkg.scripts['docs:dev']    = 'concurrently \"npm run data:watch\" \"npm run res:watch\" \"vuepress dev docs\"'
    pkg.scripts['data:create'] = 'node docs/.data/data-create.js'
    pkg.scripts['data:watch']  = 'node docs/.data/data-watch.js'
    pkg.scripts['res:create']  = 'node docs/.data/res-create.js'
    pkg.scripts['res:watch']   = 'node docs/.data/res-watch.js'
}, path => {
    console.log(chalk.gray('\n修改 ' + path))
    console.log(chalk.green('\n--------------------'))
    console.log(chalk.green('npm run data:create') + '  创建DATA到MD')
    console.log(chalk.green('npm run data:watch') + '   监听数据变化创建DATA到MD')
    console.log(chalk.green('npm run res:create') + '   创建MD到DOC')
    console.log(chalk.green('npm run res:watch') + '    监听MD变化创建MD到DOC')
    console.log(chalk.green('--------------------\n'))
})
