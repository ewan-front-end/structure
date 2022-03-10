const Path = require('path'), ARG_ARR = process.argv.slice(2)  // 命令参数
    const createFile = require('./components/createFile')
    const createHome = require('./components/createHome')

    // 依资源名(一维命名)查找数据
    let data = require('./index')
    function queryDataByResName(resName) {
        function handleDataChildren(node) {
            if (node.children) node.path += '/'
            if (node.src === resName) throw node        
            if (node.children) for (key in node.children) {handleData(key, node.children[key], node)}
        }
        function handleData(key, node, parent) {
            Object.assign(node, {parent, key, title: node.title || node.linkName || key, linkName: node.linkName || node.title || key, path: parent ? parent.path + key : ''})    
            handleDataChildren(node)
        }
        try{
            handleData('', data, null)
        } catch (node) {
            return node
        }
    }


    if (ARG_ARR.length > 0) {
        const name = ARG_ARR[0]
        const node = queryDataByResName(name) 
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