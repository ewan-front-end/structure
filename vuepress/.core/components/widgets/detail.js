const { regexpPresetParse } = require('../regexp-preset')
const REG_STYLE_STR = `(\\{[\\w\\s-;:'"#]+\\})?` // color: #f00; font-size: 14px
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
        { DETAIL_FORMAT: [{ DETAIL_INDENT: `\\x20*` }, { TITLE: `.+?` }, { SPACE: `\\s+` }, `▾`, { STYLE: REG_STYLE_STR }, { COMMENT: `[^\\n]*` }, `[\\r\\n]`, { CONTENT_INDENT: `\\x20*` }, { CONTENT_STYLE: REG_STYLE_STR }, `↧`, { CONTENT: `[^↥]+` }, `↥`] }
    ])
    const REG_DETAIL = new RegExp(REG_DETAIL_STR.value)

    let detailMatch
    while ((detailMatch = REG_DETAIL.exec(code)) !== null) {
        let { DETAIL_FORMAT, DETAIL_INDENT, TITLE, SPACE, STYLE, COMMENT, CONTENT_INDENT, CONTENT_STYLE, CONTENT } = detailMatch.groups, descStyle = 'class="detail-desc"', contentStyle = ''
        if (STYLE) descStyle += ` style="${STYLE.replace('{', '').replace('}', '')}"`
        if (CONTENT_STYLE) contentStyle = ` style="${CONTENT_STYLE.replace('{', '').replace('}', '')}"`
        code = code.replace(DETAIL_FORMAT, `<div class="fold-detail sty${SPACE.length}">${DETAIL_INDENT}<span ${descStyle}>${TITLE}</span><span class="comment">${COMMENT}</span><div class="detail-content">${CONTENT_INDENT}<span${contentStyle}>${CONTENT}</span></div></div>`)
    }
    return code
}