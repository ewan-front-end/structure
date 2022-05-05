const Path = require('path'), ARG_ARR = process.argv.slice(2)  // 命令参数
const { mkdirSync } = require('../.utils/src/fs.js')
const createFile = require('./components/createFile')
const createHome = require('./components/createHome')
const { data, queryByPath } = require('./operation.js')

// 生成文件与结构
const createItem = (item, path) => {
    const absolutePath = Path.resolve(__dirname, '..' + path)
    if (item.children) {
        mkdirSync(absolutePath)
        let readmePath = Path.resolve(absolutePath, 'README')
        if (path === '/') {
            createHome(readmePath, item)
        } else {
            createFile(readmePath, item)
        }
    } else {
        createFile(absolutePath, item)
    }
}
if (ARG_ARR.length > 0) {
    delete require.cache[require.resolve('./index')]
    setTimeout(() => {
        ARG_ARR.forEach(path => {
            let item = queryByPath(path)
            createItem(item, path)
        })
    })
} else {
    function handleDataChildren(node) {
        if (node.children) node.path += '/'
        createItem(node, node.path)
        if (node.children) for (key in node.children) { handleData(key, node.children[key], node) }
    }
    function handleData(key, node, parent) {
        Object.assign(node, { parent, key, title: node.title || node.linkName || key, linkName: node.linkName || node.title || key, path: parent ? parent.path + key : '' })
        handleDataChildren(node)
    }
    handleData('', data, null)
}
