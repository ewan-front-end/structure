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

// const { radio } = require('../.utils/src/node/inquirer-prompt')
//     const { delDest, delDirExc } = require('../.utils/src/fs.js')
//     const { UNDEPLOY } = require('../.structure/vuepress/maps.js')
//     const { copySync } = require('../.utils/src/fs.js')
//     radio('此项已部署过文档！', [{ value: 1, name: '引导重新部署' }, { value: 2, name: '清理并重新部署' }]).then(value => {
//         if (value === 1) require('./guidance.js')
//         if (value === 2) {
//             const date = new Date()
//             const hash = `${date.getFullYear()}${date.getMonth() + 1}${date.getDate()}-${date.getHours()}${date.getMinutes()}`
//             copySync(path.resolve(__dirname, '..', '.data/data.js'), path.join(__dirname, `.beifen/${hash}-data.js`))
//             copySync(path.resolve(__dirname, '..', '.data/md'), path.join(__dirname, `.beifen/${hash}-md`))

//             UNDEPLOY.forEach(item => {
//                 if (item.type === 'DEL') {
//                     const { file, dir, exclude } = item
//                     if (file) {
//                         let dest = path.resolve(root, file)
//                         delDest(dest)
//                         console.log(chalk.gray('删除 docs/' + file))
//                     } else {
//                         let dest = path.resolve(root, dir)
//                         delDirExc(dest, exclude)
//                     }
//                 }
//             })
//             delDest(path.resolve(__dirname, '../.structure'))
//             delDest(path.resolve(__dirname, '../.utils'))
//             delDest(path.resolve(__dirname, '../.data'))
//             console.log('\n')
//             console.log('.data/md      已备份到 .deploy/.benfen/md')
//             console.log('.data/data.js 已备份到 .deploy/.benfen/data.js')
//             console.log('\n')
//             console.log(chalk.green('全新部署：npm run deploy'))
//             console.log('\n')
//         }
//     })
