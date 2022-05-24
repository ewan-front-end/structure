let PATH_DATA = {}, 
    RES_DATA = {}, 
    LAYOUT_NAV = [],
    DATA = require('./data')

function handleChildren(node) {
    let {children, src, appendToNav, title} = node
    if (children) node.path += '/'
    if (children) for (key in children) { handleData(key, children[key], node) }
    if (src) RES_DATA[src] = node
    if (appendToNav) LAYOUT_NAV.push({text: title, link: node.path.match(/\/$/m) ? node.path + 'index' : node.path})
    PATH_DATA[node.path] = node
}
function handleData(key, node, parent) {
    Object.assign(node, { parent, key, title: node.title || node.linkName || key, linkName: node.linkName || node.title || key, path: parent ? parent.path + key : '' })
    handleChildren(node)
}
handleData('', DATA, null)

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

function compare(callback) {
    delete require.cache[require.resolve('./data')]
    setTimeout(() => {
        let _DATA = require('./data')
        compareDiff(DATA, _DATA, '', '')
        const arr = Object.keys(diffPath)
        callback(arr)
        diffPath = {}
        DATA = _DATA
    })
}

module.exports = {
    DATA,
    PATH_DATA,
    LAYOUT_NAV,
    queryByPath: path => {
        if (PATH_DATA[path]) return PATH_DATA[path]
        console.error(`路径为"${path}"的数据不存在！`)
    },
    queryByResName: name => {
        if (RES_DATA[name]) return RES_DATA[name]
        console.error(`引用"${name}"资源的数据不存在！`)
    },
    compare
}