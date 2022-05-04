const PATH = require('path')
const chalk = require('chalk')
const { writeFile, readFile } = require('../../.utils/src/fs.js')
const parseCode = require('./parseCode')

module.exports = (fullPath, target) => {
    let childrenContent = '' // 主题子类
    let linksContent = ''    // 主题链接
    let contentHeader = ''   // 主题标题、说明、详情
    let staticContent = ''   // 资源静态内容
    let date = new Date()
    let modifyData = 'N ' + date.toJSON().slice(0, 10).replace(/-/g, '.') + ' ' + date.toString().match(/(\d{2}\:\d{2})\:\d{2}/)[1] // 创建或更新时间
    // 主题子类
    if(target.children) {
        let liItems = ''
        for (i in target.children) {
            const child = target.children[i]
            const title = child.title || child.linkName || i
            liItems += `<li><a href="${target.path + i}">${title}</a></li>`
        }
        childrenContent = `<div class="custom-block children"><ul>${liItems}</ul></div>`
    }
    // 主题链接
    if(target.links) linksContent = `<div class="custom-block links">\n<ul class="desc">\n${target.links.map(({name, href}) => `<li><a href="${href}">${name}</a></li>\n`).join('')}</ul>\n</div>`
    // 主题标题、说明、详情
    if (target.title || target.desc || target.detail) {
        const titleStr = target.title ? `<h1>${target.title}</h1><strong>${target.title}</strong>\n` : ''
        const descStr = target.desc ? `<summary class="desc">${target.desc}</summary>\n` : ''
        const detailStr = target.detail ? `<detail>${target.detail}</detail>\n` : ''
        contentHeader += `<div class="content-header">\n${titleStr}${descStr}${detailStr}</div>`
    }
    // 资源静态内容
    if (target.src) {
        let file = readFile(PATH.resolve(__dirname, '../md/'+target.src+'.md'))
        if (file) {
            file = parseCode(file, target.path)
            staticContent += `${file}\n`
        }
    }
    let recordContent = target.prarent ? `<a class="back" href="${target.prarent.path}">上一级</a><a class="back" href="javascript:history.back();">返回</a>` : `<a class="back" href="javascript:history.back();">返回</a>`

    writeFile(fullPath + '.md',
`---
pageClass: theme-item
---
<div class="extend-header">
    <div class="info">
        <div class="record">
            ${recordContent}
        </div>
        <div class="mini">
            <span>${modifyData}</span>
        </div>
    </div>
    <div class="content">${childrenContent}${linksContent}</div>
</div>
${contentHeader}
<div class="static-content">
\n${staticContent}
</div>`, e => {
    console.log(chalk.gray('创建 docs/' + e.split('/docs/')[1]))
})
}
