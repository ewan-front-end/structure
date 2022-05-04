const Path= require("path")
const chalk = require('chalk')
const { writeFile } = require('../../.utils/src/fs.js')
/**
* 弹性盒子
* 目标：<div class="box-flex"><div class="box-flex-item flex-8">col 01</div><div class="box-flex-item classname" style="flex-basis:100px">col 02</div></div>
* 格式：
    ---------- 8             小于等于10 flex-grow: 8
    col 01
    ========== 100classname  大于10 flex-basis: n  可注入自定义classname
    col 02
    ----------
*/
const parseFlex = code => {
    let matchFLEX
    while ((matchFLEX = /\-{10,}\s(\d{1,4})([a-z-]*)[\r\n]([\s\S]+?)\-{10,}/.exec(code)) !== null) {
        let itemSize = matchFLEX[1],
            itemClass = matchFLEX[2],
            itemStyle = '',
            content = matchFLEX[3]

        if (itemSize > 10) { itemStyle = ` style="flex-basis:${itemSize}px"` } else { itemClass += ' flex-' + itemSize }

        let matchNext, itemsStr = ''
        while (matchNext = /([\s\S]+?)={10,}\s(\d{1,4})([a-z-]*)[\r\n]/.exec(content)){
            content = content.replace(matchNext[0], '')
            itemsStr += `\n<div class="box-flex-item ${itemClass}"${itemStyle}>\n${matchNext[1]}\n</div>`

            itemSize = matchNext[2],
            itemClass = matchNext[3],
            itemStyle = ''
            if (itemSize > 10) { itemStyle = ` style="flex-basis:${itemSize}px"` } else { itemClass += ' flex-' + itemSize }
        }

        itemsStr += `\n<div class="box-flex-item ${itemClass}"${itemStyle}>\n${content}\n</div>`
        code = code.replace(matchFLEX[0], `<div class="box-flex">${itemsStr}\n</div>`)
    }
    return code
}
const parseUML = code => {
    // PlantUML图形
    let matchUML
    while ((matchUML = /```plantuml[\w\W]+?```/.exec(code)) !== null) {
        const {name} = handleUML(matchUML[0])
        code = code.replace(matchUML[0], `<img :src="$withBase('/uml/${name}.png')">`)
    }
    return code
}
const parseCustomBlock = require('./parseCustomBlock')
// const Anchor = fetch('PARSE|anchor')
// const Search = fetch('PARSE|search')
// const {debounce} = fetch('UTILS|ewan')

module.exports = (code, path) => {
    // 模板符{{}} 如果有 向<pre>标签输出hasTemplate属性 用于在插件环节还原模板符
    code = code.replace(/\{\{/g, `{TEMPLATE{`)
    code = code.replace(/\}\}/g, `}TEMPLATE}`)

    // 通用链接
    //code = Anchor.parseAnchor(code, path) // 锚点
    //code = Anchor.parseTitle(code, path)  // 标题
    //code = Anchor.parseLink(code)
    
    code = parseCustomBlock.start(code, path)
    code = parseFlex(code) // 弹性盒子
    code = parseUML(code)  // 图例

    code = parseCustomBlock.end(code)

    //Anchor.save() // 保存链接数据
    
    return code
}
