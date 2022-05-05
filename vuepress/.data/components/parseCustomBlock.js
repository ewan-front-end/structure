const parseTree = require('./parseTree.js')
const { regexpPresetParse, PRESET_CSS } = require('./regexp-preset')
const aggregate = require('./aggregate.js')
const detail = require('./widgets/detail.js')
const REG_STYLE_STR = `(\\{[\\w\\s-;:'"#]+\\})?` // color: #f00; font-size: 14px
const REG_CLASS_STR = `(\\([\\w\\s-]+\\))?`      // bd sz-16 c-0

function parseCustomBlock(block, path) {
    block = block.replace(/\</g, "&lt;").replace(/\>/g, "&gt;")
    block = aggregate(block, path)

    /**
     * 行注释
     * 多匹配一个前置空格 替换时空格移到标签 防止被全等注释二次替换
     * 如：// 注释 // 注释  解析成：
     * 错误：<span class="comment"><span class="comment"> // 注释</span></span> // 注释
     * 正确： <span class="comment">// 注释</span></span> <span class="comment">// 注释</span></span>
     */
    const matchComment = block.match(/\s\d?\/\/[^\n\r]+/g) || [];
    matchComment.forEach(e => {
        let colorClass = '', _e = e.trim(), firstWord = _e.substr(0, 1)
        if (!isNaN(firstWord)) { _e = _e.replace(firstWord, ''); colorClass = ' color' + firstWord }
        block = block.replace(e, ` <span class="comment${colorClass}">${_e}</span>`)
    })
    // /* 注释 */
    const matchComment2 = block.match(/\d?\/\*[\s\S]*?\*\//g) || [];
    matchComment2.forEach(e => {
        let firstWord = e.substr(0, 1), colorClass = '', _e = e
        if (!isNaN(firstWord)) { _e = _e.replace(firstWord, ''); colorClass = ' color' + firstWord }
        block = block.replace(e, `<span class="comment${colorClass}">${_e}</span>`)
    })
    // <!-- HTML注释 -->
    const matchHtmlComment = block.match(/&lt;!--\s*[\s\S]*?\s*--&gt;/g) || [];
    matchHtmlComment.forEach(e => {
        let content = e.replace(/&lt;!--\s*/, '<span class="comment">&#60;&#33;&#45;&#45;').replace(/\s*--&gt;/, '&#45;&#45;&#62;</span>')
        block = block.replace(e, content)
    })

    // Markdown格式 [链接](#)、- 点列表、**局部加粗**
    while (/(\[([^\]\r\n]+)\]\(([^\)\r\n]+)\))/.exec(block) !== null) {
        block = block.replace(RegExp.$1, `<a href="${RegExp.$3}" target="_blank">${RegExp.$2}</a>`)
    }
    while (/^\s*(-\s([^\n\r]+))/m.exec(block) !== null) {
        block = block.replace(RegExp.$1, `● <strong>${RegExp.$2}</strong>`);
        //Search.add(path, RegExp.$2)
    }
    while (/(\*\*([0-9a-zA-Z\u4e00-\u9fa5_-]+)\*\*)/.exec(block) !== null) {
        block = block.replace(RegExp.$1, `<strong>${RegExp.$2}</strong>`)
        //Search.add(path, RegExp.$2)
    }

    // 模板符{{}}用图片表示
    block = block.replace(/\{\{/g, `&#123; &#123;`)
    block = block.replace(/\}\}/g, `&#125; &#125;`)

    /**
     * 运行命令
     * hello> npm run dev
     */
    while (/^\x20*(([\w-\/\\:\.▹◃]+)\&gt;)\s[^\r\n]+/m.exec(block) !== null) {
        block = block.replace(RegExp.$1, `<span class="run-command">${RegExp.$2}</span>`)
    }

    /**
     * 点缀集
     * 1►text◄ 2►text◄ ❶❷❸❹❺❻❼❽❾❿►text◄
     */
    const orderMap = { "❶": 1, "❷": 2, "❸": 3, "❹": 4, "❺": 5, "❻": 6, "❼": 7, "❽": 8, "❾": 9, "❿": 10 }
    while (/((\d)?([❶❷❸❹❺❻❼❽❾❿])?►([^◄]+)◄)/.exec(block) !== null) {
        let className = 'i' + (RegExp.$2 || 0)
        if (RegExp.$3) className = 'order' + orderMap[RegExp.$3]
        block = block.replace(RegExp.$1, `<i class="${className}">${RegExp.$4}</i>`)
    }

    block = detail(block)
    // Tree结构解析
    block = parseTree(block)

    // 外观盒子
    while (/(\[BOX(:\w+)?\]\x20*[\n\r]{1,2}(\x20*)([\s\S]+?)[\n\r]{1,2}\x20*?\[BOX\])/.exec(block) !== null) {
        let ALL = RegExp.$1, TYPE = RegExp.$2, INDENT = RegExp.$3, CONTENT = RegExp.$4, className = 'box'
        if (INDENT && INDENT.length > 0) {
            let reg = new RegExp(`^\\x20{${INDENT.length}}`, 'mg')
            CONTENT = CONTENT.replace(reg, '')
        }
        if (TYPE) className += TYPE.replace(':', '').toLowerCase()
        block = block.replace(ALL, `<span class="${className}">${CONTENT}</span>`)
    }

    /**
     * 标题表示一
     * 【1】 52PX
     * 【2】 40PX
     * 【3】 30PX
     * 【4】 22PX
     * 【5】 16PX
     * 【6】 12PX
     * 【fff#1#333】颜色#等级#背景
     */
    while (/\s*(【(\w{3,6}#)?(-)?(\d)(#\w{3,6})?】(.+))/.exec(block) !== null) {
        let classStr = `title${RegExp.$4}`
        let styleStr = `margin-top:${(6 - RegExp.$4) * 3}px;`
        if (RegExp.$2) styleStr += `color:#${RegExp.$2.replace('#', '')};`
        if (RegExp.$3) classStr += ` reverse${RegExp.$4}`
        if (RegExp.$5) {
            classStr += ` reverse1`
            styleStr += `background-color:${RegExp.$5}`
        }
        block = block.replace(RegExp.$1, `<span class="${classStr}" style="${styleStr}"><i></i>${RegExp.$6}</span>`)
    }
    /**
     * 标题表示二
     * ## TITLE H2 14
     * ### TITLE H3 16
     * #### TITLE H4 18
     * ##### TITLE H5 20
     * ###### TITLE H6 22
     * [####]{color:#fff}(bd) TITLE INVERT
     * 应用环境：独占一行
     */
    const REG_TIT_STR = regexpPresetParse([
        `\\x20*`,                   // 0任意空格
        {
            FORMAT: [
                { INVERT: `\\[?` },       // 反相开始 [
                { LEVEL: `#{2,6}` },      // 标题字号 #-######
                `\\]?`,                 // 反相结束 ]
                { STYLE: REG_STYLE_STR }, // 区配样式 {color: #fff}
                { CLASS: REG_CLASS_STR }, // 匹配类名 (bd)
                `\\s`,                  // 一个空格
                { TEXT: `[^\\n\\r\\{]+` } // 标题文本
            ]
        }
    ])
    const REG_TIT = new RegExp(REG_TIT_STR.value)
    let titMatch
    while ((titMatch = REG_TIT.exec(block)) !== null) {
        let { FORMAT, INVERT, LEVEL, STYLE, CLASS, TEXT } = titMatch.groups
        let classStr = `h${LEVEL.length}`
        if (INVERT) {
            classStr += ' bg3 cf'
            if (TEXT[0] !== ' ') TEXT = ' ' + TEXT
            if (TEXT[TEXT.length - 1] !== ' ') TEXT = TEXT + ' '
        }
        CLASS && (classStr += ' ' + CLASS.replace('(', '').replace(')', ''))
        let str = `class="${classStr}"`, content = TEXT
        STYLE && (str += ` style="${STYLE.replace('{', '').replace('}', '')}"`)
        block = block.replace(FORMAT, `<span ${str}>${TEXT}</span>`)
        //Search.add(path, TEXT)
    }

    // 图片 [img:$withBase('/images/左移位运算符.jpg')]
    const matchImage = block.match(/\[img:(.+?)\]/g) || [];
    matchImage.forEach(e => {
        const m = e.match(/\[img:(.+)?\]/)
        block = block.replace(e, `<img :src="${m[1]}">`)
    })

    // 表单元素[FORM_START][FORM_END]
    // [FORM_START|vtop]
    const matchForm = block.match(/\s*\[FORM_START\][\s\S]+?\[FORM_END\]\s*[\r\n]+/g) || [];
    matchForm.forEach(e => {
        let content = e.replace(/\s*\[FORM_START\]\s*[\r\n]+/, '').replace(/\s*\[FORM_END\]/, '')
        // ↴classname ↤ ↦
        while (/(↴([\w\s-;:'"#]+[\w'";])?([\s\S]*)↤([\s\S]+)↦)/.exec(content) !== null) {
            const $ALL = RegExp.$1, $STYLE = RegExp.$2, $CONTENT = RegExp.$4
            content = content.replace($ALL, `<span class="inline" style="${$STYLE}">${$CONTENT}</span>`)
        }

        // INPUT:▭{}()value▭
        while (/(▭(\(([\w\s-]+)\))?(\{([\w\s-;:'"#]+)\})?(\(([\w\s-]+)\))?(.+?)▭)/.exec(content) !== null) {
            const $ALL = RegExp.$1, $STYLE = RegExp.$5, $CLASS = RegExp.$3 || RegExp.$7 || '', $VALUE = RegExp.$8, styleStr = $STYLE ? ` style="${$STYLE}"` : ''
            content = content.replace($ALL, `<span class="input ${$CLASS}"${styleStr}>${$VALUE}</span>`)
        }
        // [BTN|正常置灰] [BTN>主题激活] [BTNbg3 cf|自定义类]
        while (/(\[BTN([\w\s-]*)([\>\|]|&gt;)(.+?)\])/.exec(content) !== null) {
            const $ALL = RegExp.$1, $CLASS = RegExp.$2, $TYPE = RegExp.$3, $VAL = RegExp.$4
            let classStr = 'button'
            $CLASS && (classStr = 'button ' + $CLASS)
            $TYPE === '&gt;' && (classStr = 'button active')
            content = content.replace($ALL, `<span class="${classStr}">${$VAL}</span>`)
        }

        // 选项卡：▥⇤Params  Authorization  [Headers]  Body  Pre-request Script  Tests  Settings▥
        while (/((\x20*)▥(⇤?)(.+?)▥)/.exec(content) !== null) {
            const $FORMAT = RegExp.$1, $INDENT = RegExp.$2, $SET_FLUSH = RegExp.$3, $CONTENT = RegExp.$4
            let html = ''
            $CONTENT.split(/\x20{2,}/).forEach(item => { html += item.indexOf('[') > -1 ? item.replace('[', '<strong>').replace(']', '</strong>') : `<i>${item}</i>` })
            html = $SET_FLUSH ? `<span class="tab">${html}</span>` : `${$INDENT}<span class="tab">${html}</span>`
            content = content.replace($FORMAT, html)
        }
        // 单选框：◉⇤none  form-data  [x-www-form-urlencoded]  raw  binary  GraphQL◉
        while (/((\x20*)◉(⇤?)(.+?)◉)/.exec(content) !== null) {
            const $FORMAT = RegExp.$1, $INDENT = RegExp.$2, $SET_FLUSH = RegExp.$3, $CONTENT = RegExp.$4
            let html = ''
            $CONTENT.split(/\x20{2,}/).forEach(item => { html += item.indexOf('[') > -1 ? item.replace('[', '<strong>').replace(']', '</strong>') : `<i>${item}</i>` })
            html = $SET_FLUSH ? `<span class="radio">${html}</span>` : `${$INDENT}<span class="radio">${html}</span>`
            content = content.replace($FORMAT, html)
        }
        // 单选框：▣⇤none  [form-data]  x-www-form-urlencoded  raw  [binary]  GraphQL▣
        while (/((\x20*)▣(⇤?)(.+?)▣)/.exec(content) !== null) {
            const $FORMAT = RegExp.$1, $INDENT = RegExp.$2, $SET_FLUSH = RegExp.$3, $CONTENT = RegExp.$4
            let html = ''
            $CONTENT.split(/\x20{2,}/).forEach(item => { html += item.indexOf('[') > -1 ? item.replace('[', '<strong>').replace(']', '</strong>') : `<i>${item}</i>` })
            html = $SET_FLUSH ? `<span class="checkbox">${html}</span>` : `${$INDENT}<span class="checkbox">${html}</span>`
            content = content.replace($FORMAT, html)
        }

        // ▼collection-name{color:#f11}(bd)▼
        // ▼{}()选项一{}()  选项二▼
        let drapdownMatch
        while ((drapdownMatch = /▼(\(([\w\s-]+)\))?(\{([\w\s-;:'"#]+)\})?(\(([\w\s-]+)\))?(.+?)▼/.exec(content)) !== null) {
            const $ALL = drapdownMatch[0], $WRAPPER_STYLE = drapdownMatch[4], $WRAPPER_CLASS = drapdownMatch[2] || drapdownMatch[6], $CONTENT = drapdownMatch[7]
            let optionsStr = ''
            $CONTENT.split('  ').forEach(option => {
                const m = option.match(/([\w\s\u4e00-\u9fa5-]+)(\(([\w\s-]+)\))?(\{([\w\s-;:'"#]+)\})?(\(([\w\s-]+)\))?/), $OPTION_TEXT = m[1], $OPTION_CLASS = m[3] || m[7] || '', $OPTION_STYLE = m[5] || ''
                let str = ''
                $OPTION_CLASS && (str += ` class="${$OPTION_CLASS}"`)
                $OPTION_STYLE && (str += ` style="${$OPTION_STYLE}"`)
                optionsStr += `<i${str}>${$OPTION_TEXT}</i>`
            })
            content = content.replace($ALL, `<span class="drop-down">${optionsStr}</span>`)
        }

        // ▤{color:#ccc}(bd)目录名称一{}()[子类名称{}(),子类名称{}()]  目录名称二▤
        // ▤菜单名称▤
        let listMatch
        while ((listMatch = /▤(\(([\w\s-]+)\))?(\{([\w\s-;:'"#]+)\})?(\(([\w\s-]+)\))?(.+?)▤/.exec(content)) !== null) {
            const $ALL = listMatch[0], $WRAPPER_STYLE = listMatch[4], $WRAPPER_CLASS = listMatch[2] || listMatch[6], $CONTENT = listMatch[7]
            let styleStr = '', className = 'list', html = ''

            $WRAPPER_STYLE && (styleStr = ` style="${$WRAPPER_STYLE}"`)
            $WRAPPER_CLASS && (className += ' ' + $WRAPPER_CLASS)
            $CONTENT.split(/\s{2,}/).forEach(item => {
                const m = item.match(/([\w\s\u4e00-\u9fa5-]+)(\(([\w\s-]+)\))?(\{([\w\s-;:'"#]+)\})?(\(([\w\s-]+)\))?(\[(.+?)\])?/), $ITEM_TEXT = m[1], $ITEM_CLASS = m[3] || m[7] || '', $ITEM_STYLE = m[5] || '', $ITEM_SUB = m[9]
                let itemClassName = 'item-title', itemStyleStr = ''
                $ITEM_CLASS && (itemClassName += ' ' + $ITEM_CLASS)
                $ITEM_STYLE && (itemStyleStr = ` style="${$ITEM_STYLE}"`)
                let itemStr = `<span class="${itemClassName}"${itemStyleStr}>${$ITEM_TEXT}</span>`
                if ($ITEM_SUB) {
                    let childrenStr = ''
                    $ITEM_SUB.split(',').forEach((e, i) => {
                        const m2 = e.match(/([\w\u4e00-\u9fa5-]+)(\(([\w\s-]+)\))?(\{([\w\s-;:'"#]+)\})?(\(([\w\s-]+)\))?/), $SUB_TEXT = m2[1], $SUB_CLASS = m2[3] || m2[7] || '', $SUB_STYLE = m2[5] || ''
                        let str = ''
                        $SUB_STYLE && (str += ` style="${$STYLE}"`)
                        $SUB_CLASS && (str += ` class="${$SUB_CLASS}"`)
                        childrenStr += `<i${str}>${$SUB_TEXT}</i>`
                    })
                    itemStr += `<span class="sub-box">${childrenStr}</span>`
                }
                html += `<span class="list-item">${itemStr}</span>`
            })
            content = content.replace($ALL, `<span class="${className}"${styleStr}><div class="list-wrapper">${html}</div></span>`)
        }

        block = block.replace(e, `<div class="form-elements">${content}</div>`)
    })

    /**
     * 表格
     * ▦⇤VARIABLE(变量){color:26f}  INITIAL VALUE(初始值)  CURRENT VALUE(当前值)
     *     API{color:26f}  https://api.com:4432  https://api.com:4432
     * ▦
     */
    while (/(▦([^▦]+)▦)/.exec(block) !== null) {
        const $FORMAT = RegExp.$1, $CONTENT = RegExp.$2
        let tableHtml = ''
        const lines = $CONTENT.split(/\x20*[\r\n]+\x20*/)
        const header = lines.splice(0, 1)[0].split(/\s{2,}/)
        const colArr = [], colsNum = header.length
        header.forEach(tit => {
            let hasStyle = tit.match(/\{([\w\s-;:'"#]+)\}/), styleStr = ''
            if (hasStyle) {
                styleStr = ` style="${hasStyle[1]}"`
                tit = tit.replace(/\{([\w\s-;:'"#]+)\}/, '')
            }
            colArr.push(`<strong>${tit}</strong>`)
        })
        lines.forEach(line => {
            const valArr = line.split(/\s{2,}/)
            for (let i = 0; i < colsNum; i++) {
                let val = valArr[i] || '', hasStyle = val.match(/\{([\w\s-;:'"#]+)\}/), styleStr = ''
                if (val.match(/^-+$/m)) val = '&nbsp;'
                if (hasStyle) {
                    styleStr = ` style="${hasStyle[1]}"`
                    val = val.replace(/\{([\w\s-;:'"#]+)\}/, '')
                }
                colArr[i] += `<i${styleStr}>${val}</i>`
            }
        })
        colArr.forEach(col => {
            tableHtml += `<span class="col">${col}</span>`
        })
        block = block.replace($FORMAT, `<span class="table">${tableHtml}</span>`)
    }

    // 行样式[{color:#f00}(bd)]
    const REG_LINE_STYLE_STR = regexpPresetParse([
        `^\\x20*`,           // 行缩进
        {
            CONTENT_FORMAT: [
                { CONTENT: `.+` }, // 格式内容
                { STYLE_FORMAT: [`\\[`, PRESET_CSS, `\\]`] }
            ]
        }
    ])
    const REG_LINE_STYLE = new RegExp(REG_LINE_STYLE_STR.value, 'gm')
    let lineStyleMatch
    while ((lineStyleMatch = REG_LINE_STYLE.exec(block)) !== null) {
        let { CONTENT_FORMAT, CONTENT, CSS, CSS_1, CSS_2 } = lineStyleMatch.groups, cssStr = ''
        if (CSS_1) {
            let text = CSS_1.substr(1, CSS_1.length - 2)
            cssStr += CSS_1.includes('{') ? ` style="${text}"` : ` class="${text}"`
        }
        if (CSS_2) {
            let text = CSS_2.substr(1, CSS_2.length - 2)
            cssStr += CSS_2.includes('{') ? ` style="${text}"` : ` class="${text}"`
        }
        block = block.replace(CONTENT_FORMAT, `<span${cssStr}>${CONTENT}</span>`)
    }

    // [盒样式{color:#f00}(bd)] 适合单行行内点缀
    const REG_BOX_STYLE_STR = regexpPresetParse([{ BOX_FORMAT: [`\\[`, { CONTENT: `[^\\{\\}\\[\\]\\(\\)]+` }, PRESET_CSS, `\\]`] }])
    const REG_BOX_STYLE = new RegExp(REG_BOX_STYLE_STR.value, 'gm')
    let boxStyleMatch
    while ((boxStyleMatch = REG_BOX_STYLE.exec(block)) !== null) {
        let { BOX_FORMAT, CONTENT, CSS, CSS_1, CSS_2 } = boxStyleMatch.groups, cssStr = ''
        if (CSS_1) {
            let text = CSS_1.substr(1, CSS_1.length - 2)
            cssStr += CSS_1.includes('{') ? ` style="${text}"` : ` class="${text}"`
        }
        if (CSS_2) {
            let text = CSS_2.substr(1, CSS_2.length - 2)
            cssStr += CSS_2.includes('{') ? ` style="${text}"` : ` class="${text}"`
        }
        block = block.replace(BOX_FORMAT, `<span${cssStr}>${CONTENT}</span>`)
    }

    // 【盒样式】{color:#f00}(bd) 适合多行大段格式化
    const REG_BOX_STYLE_STR2 = regexpPresetParse([{ BOX_FORMAT: [`【`, { CONTENT: `[^】]+` }, `】`, PRESET_CSS] }])
    const REG_BOX_STYLE2 = new RegExp(REG_BOX_STYLE_STR2.value, 'gm')
    let boxStyleMatch2
    while ((boxStyleMatch2 = REG_BOX_STYLE2.exec(block)) !== null) {
        let { BOX_FORMAT, CONTENT, CSS, CSS_1, CSS_2 } = boxStyleMatch2.groups, cssStr = ''
        if (CSS_1) {
            let text = CSS_1.substr(1, CSS_1.length - 2)
            cssStr += CSS_1.includes('{') ? ` style="${text}"` : ` class="${text}"`
        }
        if (CSS_2) {
            let text = CSS_2.substr(1, CSS_2.length - 2)
            cssStr += CSS_2.includes('{') ? ` style="${text}"` : ` class="${text}"`
        }
        block = block.replace(BOX_FORMAT, `<span${cssStr}>${CONTENT}</span>`)
    }

    /**
     * 盒子：■⇤{}()content■
     * 一个纯粹的块级元素包装
     */
    while (/(\x20*)(■(⇤?)(\([\w\s-]+\))?(\{[\w\s-;:'"#]+\})?(\([\w\s-]+\))?(\x20*[\r\n]+)?([\s\S]+?)■)/.exec(block) !== null) {
        const $INDENT = RegExp.$1, $FORMAT = RegExp.$2, $SET_FLUSH = RegExp.$3, $CLASS = RegExp.$4 || RegExp.$6, $STYLE = RegExp.$5, $CONTENT = RegExp.$8
        let str = ''
        $CLASS && (str += ` class=${$CLASS.replace('(', '"').replace(')', '"')}`)
        $STYLE && (str += ` style=${$STYLE.replace('{', '"').replace('}', '"')}`)
        block = block.replace($FORMAT, `<div${str}>${$CONTENT}</div>`)
    }

    /**
     * 变量绑定
     */
    let matchFeild
    while ((matchFeild = /(?<ALL>\x20*◢(?<OBJ>\[[^\]]+\])\x20*[\r\n]+(?<CONTENT>[\s\S]+?)◣)/.exec(block)) !== null) {
        let { ALL, OBJ, CONTENT } = matchFeild.groups
        let arr = JSON.parse(OBJ) || []
        let inputHtml = ``
        arr.forEach(({ key, label, value, color }) => {
            const reg = new RegExp(`▹${key}◃`, 'g')
            const valHtml = color ? `<span style="font-weight:bold; color:${color}" class="observe_${key}">${value}</span>` : `<span class="observe_${key}">${value}</span>`
            CONTENT = CONTENT.replace(reg, valHtml)
            inputHtml += `<div class="list">${label}:<input class="observe" data-key="${key}" style="color:${color || '#ccc'}" value="${value}" /></div>`
        })
        block = block.replace(ALL, `<div class="observe-feilds"><div class="feilds-container">${inputHtml}</div></div>${CONTENT}`)
    }

    block = block.replace('===+', '\n<pre class="code-block">').replace('===-', '</pre>')

    return block
}

module.exports = function (code, path) {
    const matchCustomBlock = code.match(/===\+[\s\S]+?===\-/g) || []
    matchCustomBlock.forEach((block) => {
        code = code.replace(block, parseCustomBlock(block, path))
    })
    return code
}
