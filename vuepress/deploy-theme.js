const path = require("path")
const { copySync, editJson } = require('../.utils/src/fs.js')
const { DEPLOY_THEME } = require('../.structure/vuepress/deploy.js')
const CWD = process.cwd();

console.log('\n');
DEPLOY_THEME.forEach(res => {
    let from = path.join(CWD, res[0].trim()), to = path.join(CWD, res[1].trim())
    copySync(from, to)
    console.log(res[0] + ' > ' + res[1] + '  ' + res[2])
})

console.log('\n');
editJson(path.join(CWD, 'package.json'), pkg => {
    pkg.scripts['update:assets'] = 'node .deploy/update-assets.js'
})

console.log('npm run update:assets 更新站点资源')

console.log('\n');