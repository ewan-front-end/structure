
const ASSETS = [
    ['.structure/vuepress/assets/favicon.ico', '.vuepress/public/favicon.ico     ', '网页标签图标']
]
const DATA = [
    ['.structure/vuepress/.data/index.js', '.data/index.js     ', '恢复DATA结构']
]
const THEME = [

]
const DEPLOY = [
    {type: 'INSTALL', from: '.structure/vuepress/guidance', to: '.abstract/guidance', desc: 'todo:更新引导'},
    {type: 'INSTALL', from: '.structure/vuepress/.vuepress', to: '.vuepress', desc: '默认主题'},
    {type: 'INSTALL', from: '.structure/vuepress/data-build.js', to: '.abstract/data-build.js', desc: 'DATA:构建'},
    {type: 'INSTALL', from: '.structure/vuepress/data-watch.js', to: '.abstract/data-watch.js', desc: 'DATA:监听'},
    {type: 'INSTALL', from: '.structure/vuepress/res-build.js', to: '.abstract/res-build.js', desc: 'RES:构建'},
    {type: 'INSTALL', from: '.structure/vuepress/res-watch.js', to: '.abstract/res-watch.js', desc: 'RES:监听'},
    {type: 'INSTALL', from: '.structure/vuepress/projects-deploy.js', to: '.abstract/projects-deploy.js', desc: '项目描述:部署'},
    {type: 'INSTALL', from: '.structure/vuepress/projects-build.js', to: '.abstract/projects-build.js', desc: '项目描述:构建'},
    {type: 'COPY',    from: '.structure/vuepress/config.js', to: '.abstract/config.js', desc: '全局配置'},
    {type: 'COPY',    from: '.structure/vuepress/md', to: '.abstract/md', desc: 'RES'},
    {type: 'COPY',    from: '.structure/vuepress/public', to: '.vuepress/public', desc: '默认主题静态资源'},
    {type: 'COPY',    from: '.structure/vuepress/data.js', to: '.abstract/data.js', desc: '数据体系'},
    {type: 'COPY',    from: '.structure/vuepress/data-module.js', to: '.abstract/data-module.js', desc: '数据模块'},
    {type: 'SCRIPT', key: 'docs:dev', value: 'concurrently \"npm run data:watch\" \"npm run res:watch\" \"vuepress dev docs\"', desc: '开发服务增加热更新'},
    {type: 'SCRIPT', key: 'data:build', value: 'node docs/.abstract/data-build.js', desc: '构建DATA'},
    {type: 'SCRIPT', key: 'data:watch', value: 'node docs/.abstract/data-watch.js', desc: '监听构建DATA'},
    {type: 'SCRIPT', key: 'res:build', value: 'node docs/.abstract/res-build.js', desc: '构建RES'},
    {type: 'SCRIPT', key: 'res:watch', value: 'node docs/.abstract/res-watch.js', desc: '监听构建RES'},
    {type: 'SCRIPT', key: 'projects:deploy', value: 'node docs/.abstract/projects-deploy.js', desc: '部署项目描述'},
    {type: 'SCRIPT', key: 'projects:build', value: 'node docs/.abstract/projects-build.js ', desc: '构建项目描述'}
]

module.exports = {
    DEPLOY,
    ASSETS,
    DATA,
    THEME
}