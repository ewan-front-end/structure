const Path = require('path'), ARG_ARR = process.argv.slice(2)  // 命令参数
const { mkdirSync } = require('../.utils/fs.js')
const createFile = require('./components/createFile')
const createHome = require('./components/createHome')
let data = require('./index')

// 依据路径获取数据
const getDataByPath = path => {
    console.log('---',path);
    let arr = path.substring(1).split('/'), res = data, prop
    res.path = '/'
    console.log(arr);
    while (prop = arr.shift()) {
        const parentPath = res.path
        if (prop) {
            res = res.children[prop]
            res.path = parentPath + prop
        }
    }
    res.path = path
    return res
}
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
        data = require('./index')
        ARG_ARR.forEach(path => {
            let item = getDataByPath(path)
            createItem(item, path)
        })
    })
} else {
    function handleDataChildren(node) {
        if (node.children) node.path += '/'
        createItem(node, node.path)
        if (node.children) for (key in node.children) {handleData(key, node.children[key], node)}
    }
    function handleData(key, node, parent) {
        Object.assign(node, {parent, key, title: node.title || node.linkName || key, linkName: node.linkName || node.title || key, path: parent ? parent.path + key : ''})
        handleDataChildren(node)
    }
    handleData('', data, null)
}
