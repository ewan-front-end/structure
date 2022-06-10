/**
 *  [TREE]
    第一层                注释说明[ACTIVE]
        第二层            注释说明
        第二层
            第三层        注释说明
                第四层    注释说明
        第二层            注释说明
            第三层        注释说明
    第一层                注释说明
    [TREE]
 */
const indentNum = 4 

module.exports = function (block) {
    while (/(\x20*\[TREE\]\x20*[\n\r]{1,2}([\s\S]+)[\n\r]{1,2}\x20*\[TREE\]\x20*[\n\r]{1,2})/.exec(block) !== null) {
        const ALL = RegExp.$1, CONTENT = RegExp.$2
        let lines = CONTENT.split(/[\n\r]/), level = [[]], levelIndex = 0, prevLine = null, countForId = 0
        lines.forEach(line => {
            let res = /(^\x20*)(.+)/.exec(line)
            if (res) {
                let indent = res[1],
                    arr = res[2].split('  '),
                    tit = arr[0],
                    desc = res[2].substring(tit.length),
                    curLine = {}
                if (res[2].match(/\[ACTIVE\]$/m)) {
                    curLine.defaultActive = true
                    tit = tit.replace('[ACTIVE]', '')
                    desc = desc.replace('[ACTIVE]', '')
                }
                Object.assign(curLine, { indent, tit, desc })

                if (prevLine === null) prevLine = curLine
                // 缩进规范
                if ((indent.length - prevLine.indent.length) % indentNum > 0) throw '层级缩进错误：' + res[0]
                // 同级
                if (indent === prevLine.indent) level[levelIndex].push(curLine)
                // 子级
                if (indent.length > prevLine.indent.length) {
                    if (indent.length - prevLine.indent.length !== indentNum) throw '子级缩进错误：' + res[0]
                    let arr = [], id = 'tree-children-' + countForId
                    level.push(arr)             // 扁平级别
                    level[levelIndex].push(arr) // 树状级别
                    levelIndex++
                    
                    arr.push(curLine)
                    if (prevLine.defaultActive) curLine.defaultActive = true
                    curLine.id = id
                    prevLine.children = id
                    countForId++
                }
                // 级别回归
                if (indent.length < prevLine.indent.length) {
                    const backIndex = (indent.length - prevLine.indent.length) / indentNum
                    levelIndex += backIndex
                    level.splice(levelIndex + 1)
                    level[levelIndex].push(curLine)
                }
                prevLine = curLine
            }
        })

        function handleArr(arr) {
            let html = ''
            arr.forEach(line => {
                html += handleObj(line)
            })
            return html
        }
        function handleObj(line) {
            if (Object.prototype.toString.call(line) === "[object Object]") {
                let titleClass = 'title', titleHtml
                if (line.defaultActive) titleClass += ' active'
                if (line.children) {
                    titleClass += ' switch'
                    titleHtml = `<span class="${titleClass}" data-target="${line.children}">${line.tit}</span>`
                } else {
                    titleHtml = `<span class="title">${line.tit}</span>`
                }
                let commentHtml = line.desc ? `<span class="comment">${line.desc}</span>` : ``
                return `${line.indent}${titleHtml}${commentHtml}<br>`
            }
            if (Object.prototype.toString.call(line) === "[object Array]") {
                let id = line[0].id
                let className = line[0].defaultActive ? 'tree-children-container active' : 'tree-children-container'
                return `<div class="${className}" id="${id}">${handleArr(line)}</div>`
            }
        }
        let html = ``
        level[0].forEach(line => {
            html += handleObj(line)
        })
        block = block.replace(ALL, `<div class="tree">${html}</div>`)
    }
    return block
}