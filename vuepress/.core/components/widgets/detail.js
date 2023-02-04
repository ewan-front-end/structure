const { regexpPresetParse } = require('../regexp-preset')
const REG_STYLE_STR = `(\\{[\\w\\s-;:'"#]+\\})?` // color: #f00; font-size: 14px
const REG_CLASS_STR = `(\\([\\w\\s]+\\))?`
/**
 * 折叠详情
 * -----------
 * 普通 ▾
 * ↧Detail Content↥
 * 标题样式 ▾{color:#3ac}
 * ↧Detail Content↥
 * 内容样式 ▾
 * {color:#3ac}↧Detail Content↥
 * -----------
 * 事件处理：.vuepress/theme/layouts/Layout.vue
    mounted () {
        const $details = document.querySelectorAll('.fold-detail')
        $details.forEach(dom => {
            dom.addEventListener('click', e => {
                let tar = e.currentTarget
                tar.className = tar.className === 'fold-detail' ? 'fold-detail active' : 'fold-detail'
            })
        })
    }
    */
module.exports = code => {
    const REG_DETAIL_STR = regexpPresetParse([
        { DETAIL_FORMAT: [{ DETAIL_INDENT: `\\x20*` }, { TITLE: `.+?` }, { SPACE: `\\s+` }, `▾`, { STYLE: REG_STYLE_STR }, { CLASS: REG_CLASS_STR }, { COMMENT: `[^\\{\\}\\(\\)\\n]*` }, `[\\r\\n]`, { CONTENT_INDENT: `\\x20*` }, { CONTENT_STYLE: REG_STYLE_STR }, { CONTENT_CLASS: REG_CLASS_STR }, `↧`, { CONTENT: `[^↥]+` }, `↥`] }
    ])
    const REG_DETAIL = new RegExp(REG_DETAIL_STR.value)

    let detailMatch
    while ((detailMatch = REG_DETAIL.exec(code)) !== null) {
        let { DETAIL_FORMAT, DETAIL_INDENT, TITLE, SPACE, STYLE, CLASS, COMMENT, CONTENT_INDENT, CONTENT_STYLE, CONTENT_CLASS, CONTENT } = detailMatch.groups
        let descStyle = ''
        let descClass = 'detail-desc'
        let contentStyle = ''
        let contentClass = ''
        if (CLASS) descClass += ' ' + CLASS.replace('(', '').replace(')', '')
        if (STYLE) descStyle += ` style="${STYLE.replace('{', '').replace('}', '')}"`
        if (CONTENT_STYLE) contentStyle = ` style="${CONTENT_STYLE.replace('{', '').replace('}', '')}"`
        if (CONTENT_CLASS) contentClass = ` class="${CONTENT_CLASS.replace('(', '').replace(')', '')}"`
        code = code.replace(DETAIL_FORMAT, `<div class="fold-detail sty${SPACE.length}">${DETAIL_INDENT}<span class="${descClass}"${descStyle}>${TITLE}</span><span class="comment">${COMMENT}</span><div class="detail-content">${CONTENT_INDENT}<span${contentStyle}${contentClass}>${CONTENT}</span></div></div>`)
    }
    return code
}