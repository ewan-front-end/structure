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
    },
    // 生产环境的构建结束后被调用
    async generated (pagePaths) {
        console.log('generated')
    }
}