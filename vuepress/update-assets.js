const path = require("path")
const { copySync } = require('../.utils/src/fs.js')
const { DEPLOY_ASSETS } = require('../.structure/vuepress/deploy.js')
const CWD = process.cwd();

DEPLOY_ASSETS.forEach(res => {
    let from = path.join(CWD, res[0].trim()), to = path.join(CWD, res[1].trim())
    copySync(from, to)
    console.log(res[0] + ' > ' + res[1] + '  ' + res[2])
})