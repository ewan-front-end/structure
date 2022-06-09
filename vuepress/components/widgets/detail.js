const { regexpPresetParse } = require('../regexp-preset')
const REG_STYLE_STR = `(\\{[\\w\\s-;:'"#]+\\})?` // color: #f00; font-size: 14px
/**
 * Detail
 * 突出简介隐藏详情
 * -----------
 * 标题 ▾ 说明
 *   ↧↥
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
        { DETAIL_FORMAT: [{ DETAIL_INDENT: `\\x20*` }, { TITLE: `.+?` }, { SPACE: `\\s+` }, `▾`, { STYLE: REG_STYLE_STR }, { COMMENT: `[^\\n]*` }, `[\\r\\n]`, { CONTENT_INDENT: `\\x20*` }, `↧`, { CONTENT: `[^↥]+` }, `↥`] }
    ])
    const REG_DETAIL = new RegExp(REG_DETAIL_STR.value)

    let detailMatch
    while ((detailMatch = REG_DETAIL.exec(code)) !== null) {
        let { DETAIL_FORMAT, DETAIL_INDENT, TITLE, SPACE, STYLE, COMMENT, CONTENT_INDENT, CONTENT } = detailMatch.groups, descStyle = 'class="detail-desc"'
        if (STYLE) descStyle += ` style="${STYLE.replace('{', '').replace('}', '')}"`
        code = code.replace(DETAIL_FORMAT, `<div class="fold-detail sty${SPACE.length}">${DETAIL_INDENT}<span ${descStyle}>${TITLE}</span><span class="comment">${COMMENT}</span><div class="detail-content">${CONTENT_INDENT}<span>${CONTENT}</span></div></div>`)
    }
    return code
}