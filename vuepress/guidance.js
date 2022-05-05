const { input, checkbox, radio, confirm, password } = require('../.utils/src/node/inquirer-prompt')

radio('重新部署类型:', [
    { value: 0, name: '无' },
    { value: 1, name: 'STRUCTURE' },
    { value: 2, name: 'DATA' },
    { value: 3, name: 'THEME' }
]).then(value => {
    value === 1 && deployStructure()
})

function deployStructure() {
    const options = []
    const { DEPLOY_STRUCTURE } = require('../.structure/vuepress/maps.js')
    DEPLOY_STRUCTURE.forEach(res => {
        options.push(res[2])
    })

    checkbox('请勾选STRUCTURE选项:', options).then(arr => {
        if (arr.length > 0) {

        }
    })
}
