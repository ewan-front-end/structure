const Path = require('path'), ARG_ARR = process.argv.slice(2)  // 命令参数
const createFile = require('./components/createFile')
const createHome = require('./components/createHome')
const {queryByResName} = require('./index')

if (ARG_ARR.length > 0) {
    const name = ARG_ARR[0]
    const node = queryByResName(name) 
    if (node) {
        let path = node.path
        if (path.match(/\/$/m)) path += 'README'
        if (path === '/README') {
            createHome(Path.resolve(__dirname, '..' + path), node)
        } else {
            createFile(Path.resolve(__dirname, '..' + path), node)
        }
    } else {
        console.log(`数据结构里不存在资源：${name}.md`)
    }    
}