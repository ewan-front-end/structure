const chalk = require('chalk')
const W_TYPE = 10, W_FROM = 40, W_TO = 30
const holdStrLen = (str, len) => `${str}                                                  `.substr(0, len);

const Printer = {
    SCRIPT: ({ key, desc, param }, indent, excludes) => {
        if (excludes && excludes.includes(key)) return
        indent = ' '.repeat(indent * 2)
        console.log(indent + chalk.gray(holdStrLen('npm run ' + key, W_FROM) + desc))
        param && console.log(indent + chalk.gray(holdStrLen('npm run ' + key + ' ' + param, W_FROM) + desc + '指定项'))
    },
    INSTALL: ({ from, to, desc }, indent) => {
        indent = ' '.repeat(indent * 2)
        console.log(indent + chalk.gray(`${holdStrLen(from, W_FROM)}安装到${holdStrLen(to, W_TO)}${desc}`))
    },
    COPY: ({ from, to, desc }, indent) => {
        indent = ' '.repeat(indent * 2)
        console.log(indent + chalk.gray(`${holdStrLen(from, W_FROM)}拷贝到${holdStrLen(to, W_TO)}${desc}`))
    },
    BACKUPS: ({ from, to, desc }, indent) => {
        indent = ' '.repeat(indent * 2)
        console.log(indent + chalk.gray(`${holdStrLen(from, W_FROM)}备份到${holdStrLen(to, W_TO)}${desc}`))
    },
    UNINSTALL: (item, indent) => {
        indent = ' '.repeat(indent * 2)
        console.log(indent + chalk.gray(item))
    }
}
function iterateList(children, indent, excludes) {
    children.forEach(child => {
        iterateItem(child, indent, excludes)
    })
}
function iterateItem(item, indent, excludes) {
    const { name, title, children, type, inverse, space } = item
    if (name && title && children) {
        space && console.log('');
        const tit = inverse ? chalk.gray.inverse(title) : chalk.gray(title)
        console.log(' '.repeat(indent * 2) + tit) // 打印标题
        iterateList(children, indent + 1, excludes)
    }
    if (type) Printer[type](item, indent + 1, excludes)
}

module.exports = {
    holdStrLen,
    fillStr: holdStrLen,
    Printer,
    iterateList,
    iterateItem
}