const INSTALL = [
    { type: 'INSTALL', from: '.structure/vuepress/.core', to: '.abstract/.core', desc: '' },
    { type: 'INSTALL', from: '.structure/vuepress/.vuepress', to: '.vuepress', desc: '默认主题' },
]
const COPY = [
    { type: 'COPY', from: '.structure/vuepress/config.js', to: '.abstract/config.js', desc: '全局配置' },
    { type: 'COPY', from: '.structure/vuepress/md', to: '.abstract/md', desc: 'RES' },
    { type: 'COPY', from: '.structure/vuepress/data.js', to: '.abstract/data.js', desc: '数据体系' },
]
const BACKUPS = [
    { type: 'BACKUPS', from: '.structure/vuepress/public', to: '.vuepress/public', desc: '默认主题静态资源' }
]

const UNINSTALL = [
    '.abstract/.structure',
    '.abstract/.utils'
]

const SCRIPTS_DATA = [
    { type: 'SCRIPT', key: 'data:build', value: 'node docs/.abstract/.core/data-build.js', desc: '构建DATA', param: '/database/mysql' },
    { type: 'SCRIPT', key: 'data:watch', value: 'node docs/.abstract/.core/data-watch.js', desc: '监听构建DATA' }
]
const SCRIPTS_RES = [
    { type: 'SCRIPT', key: 'res:build', value: 'node docs/.abstract/.core/res-build.js', desc: '构建RES', param: 'demo.md' },
    { type: 'SCRIPT', key: 'res:watch', value: 'node docs/.abstract/.core/res-watch.js', desc: '监听构建RES' }
]
// const SCRIPTS_PROJECTS = [
//     { type: 'SCRIPT', key: 'projects:deploy', value: 'node docs/.abstract/.core/projects-deploy.js', desc: '部署' },
//     { type: 'SCRIPT', key: 'projects:build', value: 'node docs/.abstract/.core/projects-build.js', desc: '构建', param: 'demo.md' }
// ]
const SCRIPTS_DEPLOY = [
    { type: 'SCRIPT', key: 'deploy', value: 'node docs/.abstract/index.js', desc: '重新部署' },
    { type: 'SCRIPT', key: 'undeploy', value: 'node docs/.abstract/.core/undeploy.js', desc: '重新部署' }
]
// 导航
const SCRIPTS_NAVIGATION_N = [
    { type: 'SCRIPT', key: 'navigate', value: 'node docs/.abstract/.core/navigate.js', desc: '扩展:归置', param: 'arrangements' },
    { type: 'SCRIPT', key: 'navigate', value: 'node docs/.abstract/.core/navigate.js', desc: '扩展:了然', param: 'glanceclear' },
    { type: 'SCRIPT', key: 'navigate', value: 'node docs/.abstract/.core/navigate.js', desc: '扩展:活现', param: 'vividness' },
    { type: 'SCRIPT', key: 'navigate', value: 'node docs/.abstract/.core/navigate.js', desc: '扩展:其它', param: 'xxxx' },
]
const SCRIPTS_NAVIGATION_G = [
    { type: 'SCRIPT', key: 'generate', value: 'node docs/.abstract/.core/generate.js', desc: '生成全部' },
    { type: 'SCRIPT', key: 'generate', value: 'node docs/.abstract/.core/generate.js', desc: '生成:归置', param: 'arrangements' },
    { type: 'SCRIPT', key: 'generate', value: 'node docs/.abstract/.core/generate.js', desc: '生成:了然', param: 'glanceclear' },
    { type: 'SCRIPT', key: 'generate', value: 'node docs/.abstract/.core/generate.js', desc: '生成:活现', param: 'vividness' },
    { type: 'SCRIPT', key: 'generate', value: 'node docs/.abstract/.core/generate.js', desc: '生成:其它', param: 'xxxx' },
]
const SCRIPTS_NAVIGATION = [...SCRIPTS_NAVIGATION_N, ...SCRIPTS_NAVIGATION_G]

const SCRIPTS = ([
    { type: 'SCRIPT', key: 'help', value: 'node docs/.abstract/.core/help.js', desc: '帮助' },
    { type: 'SCRIPT', key: 'docs:dev', value: 'concurrently \"npm run data:watch\" \"npm run res:watch\" \"vuepress dev docs\"', desc: '开发服务增加热更新' }
]).concat(SCRIPTS_DATA, SCRIPTS_RES, SCRIPTS_DEPLOY) // SCRIPTS_PROJECTS,




const HELP_SCRIPTS = [
    { name: 'DATA', title: '数据结构', children: SCRIPTS_DATA },
    { name: 'RES', title: '数据资源', children: SCRIPTS_RES },
    //{ name: 'PROJECTS', title: '项目描述相关命令', children: SCRIPTS_PROJECTS },
    { name: 'DEPLOY', title: '安装与卸载', children: SCRIPTS_DEPLOY }
]
const Help_DEPLOY = [
    { name: 'INSTALL', title: '安装部署 需面向卸载', children: INSTALL },
    { name: 'COPE', title: '安装部署 无需面向卸载', children: COPY },
    { name: 'BACKUPS', title: '安装部署 卸载时需要备份', children: BACKUPS },
    { name: 'UNINSTALL', title: '卸载删除项', children: UNINSTALL }
]
const HELP = [
    { name: 'SCRIPTS', title: ' 命令行 ', children: HELP_SCRIPTS, inverse: true },
    { name: 'DEPLOY', title: ' 部署调度 ', children: Help_DEPLOY, inverse: true, space: true },
    {
        name: 'SCENE', title: ' 场景 ', inverse: true, space: true, children: [
            {
                title: '部署文档系统', children: [
                    '笔记：projects/notebook.html',
                    '1. sudo npm i concurrently -g',
                    '2. npm run data:build',
                    '3. npm run projects:build'
                ]
            },
            { title: '扩展导航', children: SCRIPTS_NAVIGATION }
        ]
    }
]

module.exports = {
    DEPLOY: INSTALL.concat(COPY, BACKUPS),
    INSTALL,
    COPY,
    BACKUPS,
    SCRIPTS,
    UNINSTALL,
    HELP,
    HELP_SCRIPTS,
    SCRIPTS_NAVIGATION_G
    //SCRIPTS_PROJECTS
}