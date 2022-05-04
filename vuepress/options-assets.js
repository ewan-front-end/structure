const path = require("path")
const { copySync } = require('../.utils/src/fs.js')
const { DEPLOY_ASSETS } = require('../.structure/vuepress/deploy.js')
const CWD = process.cwd();

DEPLOY_ASSETS.forEach(res => {
    let from = path.join(CWD, res[0].trim()), to = path.join(CWD, res[1].trim())
    copySync(from, to)
    console.log(chalk.gray('部署 ' + res[0] + ' 到 ') + chalk.white(res[1]) + chalk.gray('  ' + res[2]))
})