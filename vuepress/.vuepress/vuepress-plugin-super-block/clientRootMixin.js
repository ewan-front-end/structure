// 可以控制根组件的生命周期
export default {
    created () {
        console.log('created');
    },
    mounted () {
        console.log('mounted')
    },
    updated() {
        console.log('updated')
        document.querySelectorAll('pre').forEach(el => {
            //el.innerHTML = el.innerHTML.replace(/\{TEMPLATE\{/g, '{{').replace(/\}TEMPLATE\}/g, '}}')
            //console.log(document.querySelector('body').innerHTML.match(/\{TEMPLATE\{/));
            const arr = el.innerHTML.match(/\{TEMPLATE\{/g)
            if (arr) {
                console.log(arr);
                el.innerHTML = el.innerHTML.replace(/\{TEMPLATE\{/g, '{{').replace(/\}TEMPLATE\}/g, '}}')
            }
        })
        
        const $details = document.querySelectorAll('.detail-desc')
        $details.forEach(dom => {
            dom.addEventListener('click', e => {
                let tar = e.currentTarget.parentNode
                tar.className = tar.className === 'fold-detail' ? 'fold-detail active' : 'fold-detail'
            })
        })

        const $errors = document.querySelectorAll('.format-error')
        $errors.forEach(dom => {
            const header = dom.querySelector('.header')
            const content = dom.querySelector('.content')
            if (content) {
                header.style.cursor = 'pointer'
                header.addEventListener('click', e => {
                    const display = getComputedStyle(content).display
                    content.style.display = display === 'none' ? 'block' : 'none'
                })
            }
        })

        const $tree_switch = document.querySelectorAll('.tree .switch')
        $tree_switch.forEach(dom => {
            dom.addEventListener('click', e => {
                let tar = e.target
                let tarClass = tar.className
                let id = tar.getAttribute('data-target')
                let box = document.querySelector('#' + id)
                tar.className = tarClass.includes('active') ? tarClass.replace(/\s?active/, '') : tarClass + ' active'
                box.className = box.className === 'tree-children-container' ? 'tree-children-container active' : 'tree-children-container'
            })
        })

        const setChildreVal = (c, v) => {
            c.forEach(e => {
                e.innerText = v
            })
        }
        document.querySelectorAll('input.observe').forEach(input => {
            const key = input.getAttribute('data-key')
            const children = document.querySelectorAll('.observe_' + key)
            input.addEventListener('change', e => {
                const val = e.target.value
                setChildreVal(children, val)
            })
        })
        // 选项卡
        const tabElements = document.querySelectorAll('.format-tab')
        tabElements.forEach(ele => {
            ele.addEventListener('click', e => {
                const container = e.currentTarget
                const tar = e.target
                const tarIndex = tar.getAttribute('data-index')
                if (tar.className === 'tab-title-item'){
                    container.className = 'format-tab active' + tarIndex
                }
            })
        })
    },
    // 生产环境的构建结束后被调用
    async generated (pagePaths) {
        console.log('generated')
    }
}