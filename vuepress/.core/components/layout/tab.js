module.exports = (block) => {
    const tabGroup = {}
    while (/((.+)\x20\[TAB:(\w+)(-)?\][\n\r]{1,2}([\s\S]+?)\[TAB\])/.exec(block) !== null) {
        const title = RegExp.$2
        const groupName = RegExp.$3
        const active = RegExp.$4
        const content = RegExp.$5

        if (tabGroup[groupName]) {
            const item = tabGroup[groupName]
            if (!!active) item.index = item.options.length
            item.options.push({title, content})
            block = block.replace(RegExp.$1, '');
        } else {
            tabGroup[groupName] = {index: 0, options: [{title, content}]}
            block = block.replace(RegExp.$1, `[TAB:${groupName}]`);
        }
    }

    for (let id in tabGroup) {
        const {index, options} = tabGroup[id]
        let titles = '', contents = ''
        options.forEach(({title, content}, i) => {
            titles += `<span class="tab-title-item" data-index="${i}">${title}</span>`
            contents += `<div class="tab-content-item" data-index="${i}">${content}</div>`
        })
        let html = `<div class="format-tab active${index}"><div class="tab-title-box">${titles}</div><div class="tab-content-box">${contents}</div></div>`
        const reg = new RegExp(`\\[TAB:${id}\\][\\n\\r]{1,3}`)
        block = block.replace(reg, html);
    }
    return block
}