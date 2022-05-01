const path = require("path")
const { copySync } = require('../.utils/src/fs.js')
const CWD = process.cwd();

([
    ['.structure/vuepress/assets/favicon.ico     ', 'docs/.vuepress/public/favicon.ico']
]).forEach(res => {
    let from = path.join(CWD, res[0].trim()), to = path.join(CWD, res[1].trim())
    copySync(from, to)
    console.log(res[0] + ' > ' + res[1])
})