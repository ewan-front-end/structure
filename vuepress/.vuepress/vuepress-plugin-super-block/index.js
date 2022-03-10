const path = require('path')
/**
 * @param {*} options 插件的配置选项
 * @param {*} ctx 编译期上下文
 * @returns
 */
module.exports = (options, ctx) => {
    return {
        name: 'vuepress-plugin-super-block',
        async ready() {
            console.log('********Hello World superblock!');
        },
        clientRootMixin: path.resolve(__dirname, 'clientRootMixin.js')
    }
}