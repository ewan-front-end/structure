const path = require("path")
const { copySync } = require('../.utils/src/fs.js')
const { DEPLOY_DATA } = require('../.structure/vuepress/deploy.js')
const CWD = process.cwd();

const funInfo = []
DEPLOY_DATA.forEach(res => {
    let from = path.join(CWD, res[0].trim()), to = path.join(CWD, res[1].trim())
    copySync(from, to)
    console.log(res[0] + ' > ' + res[1] + '  ' + res[2])
    if (res.length > 3) funInfo.push(res[3])
})
funInfo.forEach(info => {
    console.log(info)
})