const Path = require('path'), ARG_ARR = process.argv.slice(2)  // 命令参数
const createFile = require('./components/createFile')
const createHome = require('./components/createHome')
const { PATH_DATA, queryByPath } = require('./index.js')

// 生成文件与结构
const createItem = node => {
    let path = node.path, abs
    if (path.match(/\/$/m)) path += 'README'
    abs = Path.resolve(__dirname, '..' + path)
    if (path === '/README') {
        createHome(abs, node)
    } else {
        createFile(abs, node)
    }
}

if (ARG_ARR.length > 0) {
    ARG_ARR.forEach(path => {
        let node = queryByPath(path)
        createItem(node)
    })
} else {
    Object.values(PATH_DATA).forEach(node => {
        createItem(node)
    })
}
