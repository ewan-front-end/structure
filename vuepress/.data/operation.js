const data = require('./index')

const queryByPath = path => {
    if (/^\//.test(path)) path = path.replace('/', '')
    let arr = path.split('/'),
        res = data,
        key
    res.path = '/'
    while (key = arr.shift()) {
        const parentPath = res.path
        if (key) {
            res = res.children[key]
            res.path = parentPath + key
            if (res.children) res.path += '/'
        }
    }
    return res
}

const queryByName = name => {
    function handleDataChildren(node) {
        if (node.children) node.path += '/'
        if (node.src === name) throw node
        if (node.children) for (key in node.children) { handleData(key, node.children[key], node) }
    }
    function handleData(key, node, parent) {
        Object.assign(node, { parent, key, title: node.title || node.linkName || key, linkName: node.linkName || node.title || key, path: parent ? parent.path + key : '' })
        handleDataChildren(node)
    }
    try {
        handleData('', data, null)
    } catch (res) {
        return res
    }
}

module.exports = {
    data,
    queryByPath,
    queryByName
}

// const item = queryByPath('/demo')
// const nameItem = queryByName('demo')
// console.log(item)
// console.log(nameItem)