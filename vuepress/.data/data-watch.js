const exec = require('child_process').exec, Path = require('path'), chokidar = require('chokidar')

let dataFile = require('./index')

// 对比差异
let diffPath = {}
const addChild = (node, path) => {
    if (node.children) {
        path += '/'
        diffPath[path] = true
        addChildren(node.children, path)
    } else {
        diffPath[path] = true
    }
}
const addChildren = (children, parentPath) => {
    for (var key in children) {addChild(children[key], parentPath + key)}
}
function handleDataChildren(oChildren, nChildren, parentPath) {
    for (key in nChildren) { 
        compareDiff(oChildren[key], nChildren[key], key, parentPath) 
    }
}
function compareDiff(oNode, nNode, key, parentPath) {
    let path = parentPath + key
    if (nNode.children) {
        path += '/'
        if (oNode && oNode.children) {
            handleDataChildren(oNode.children, nNode.children, path)
        } else {
            diffPath[path] = true
            diffPath[parentPath + '/'] = true
            addChildren(nNode.children, path)
        }
    }
    for (var key in nNode) {
        if (key === 'title' || key === 'desc' || key === 'src') {
            if (oNode) {
                nNode[key] !== oNode[key] && (diffPath[path] = true)
            } else {
                diffPath[path] = true
                diffPath[parentPath] = true
            }
        }
    }
}
chokidar.watch(Path.resolve(__dirname, 'index.js'))
    .on('error', error => log(`data监听错误: ${error}`))
    .on('change', path => {
        delete require.cache[require.resolve('./index')]
        setTimeout(() => {
            const dataFile2 = require('./index')
            compareDiff(dataFile, dataFile2, '', '')
            const arr = Object.keys(diffPath)
            if (arr.length) {
                exec(`node ${Path.resolve(__dirname, 'data-create.js')} ${arr.join(' ')}`, function(error, stdout, stderr) {
                    error && console.log(error)
                    stdout && console.log(stdout)
                    stderr && console.log(stderr)
                })
            }
            diffPath = {}
            dataFile = dataFile2
        })
    })
