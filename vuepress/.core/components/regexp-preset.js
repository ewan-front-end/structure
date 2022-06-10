function htmlEscape(content) {
    return content.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function arrayToRegStr(arr, parentKey) {
    let value = ``, html = ``
    arr.forEach(item => { 
        let res = objToRegStr(item)
        value += res.value 
        html += res.html
    })
    return {
        value: `(${value})`, 
        html
    }
}
function objToRegStr(e) {        
    if (typeof e === 'string') return { value: e, html: e }        
    if (Object.prototype.toString.call(e) === '[object Object]') {
        let value = `(?`, html, count = 0
        for (let i in e) {
            if (count > 0) throw '自定义正则字符串格式，不能包含一个以上命名: ' + i
            value += `<${i}>`
            html = `【i data-add="${i}"】(?`
            if (typeof e[i] === 'string') {
                value += e[i]
                html += e[i]
            } else if (Object.prototype.toString.call(e[i]) === '[object Array]') {
                let res = arrayToRegStr(e[i], i)
                value += res.value
                html += res.html
            } else {
                throw '命名正则段值类型仅能为string和字面量数组'
            }
            count++
        }
        value += `)`
        html += `)【/i】`
        //console.log(value);
        return {
            value,
            html
        }
    } else {
        throw '非法自定义正则段格式: ' + e
    }       
}

module.exports = {
    regexpPresetParse: arr => {
        let value = ``, html = ``
        arr.forEach(item => { 
            let res = objToRegStr(item)
            value += res.value 
            html += res.html
        })
        return {
            value,
            html: `<span class="regexp">${htmlEscape(html).replace(/【/g, '<').replace(/】/g, '>')}</span>`
        }       
    },
    PRESET_CSS: {
        CSS: [
            {CSS_1: `\\{[\\w\\s-;:'"#]+\}|\\([\\w\\s-]+\\)`},
            {CSS_2: `(\\{[\\w\\s-;:'"#]+\\})?(\\([\\w\\s-]+\\))?`}
        ]
    }
}