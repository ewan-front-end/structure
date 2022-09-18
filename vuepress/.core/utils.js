const chalk = require('chalk')
const W_TYPE = 10, W_FROM = 40, W_TO = 30
const holdStrLen = (str, len) => `${str}                                                  `.substr(0, len);
const INDENT_UNIT = 4

const Printer = {
    SCRIPT: ({ key, desc, param }, indent, excludes) => {
        if (excludes && excludes.includes(key)) return
        indent = ' '.repeat(indent * INDENT_UNIT)
        let text = 'npm run ' + key
        param && (text += ' ' + param)
        console.log(indent + chalk.gray(holdStrLen(text, W_FROM) + desc))
    },
    INSTALL: ({ from, to, desc }, indent) => {
        indent = ' '.repeat(indent * INDENT_UNIT)
        console.log(indent + chalk.gray(`${holdStrLen(from, W_FROM)}安装到${holdStrLen(to, W_TO)}${desc}`))
    },
    COPY: ({ from, to, desc }, indent) => {
        indent = ' '.repeat(indent * INDENT_UNIT)
        console.log(indent + chalk.gray(`${holdStrLen(from, W_FROM)}拷贝到${holdStrLen(to, W_TO)}${desc}`))
    },
    BACKUPS: ({ from, to, desc }, indent) => {
        indent = ' '.repeat(indent * INDENT_UNIT)
        console.log(indent + chalk.gray(`${holdStrLen(from, W_FROM)}备份到${holdStrLen(to, W_TO)}${desc}`))
    },
    UNINSTALL: (item, indent) => {
        indent = ' '.repeat(indent * INDENT_UNIT)
        console.log(indent + chalk.gray(item))
    }
}
function iterateList(children, indent, excludes) {
    children.forEach(child => {
        iterateItem(child, indent, excludes)
    })
}
function iterateItem(item, indent, excludes) {
    if (typeof item === 'string') {
        console.log(' '.repeat(indent * INDENT_UNIT) + chalk.gray(item))
        return
    }
    /*
    type     格式类型 
    inverse  标题反相
    space    前置留空
    */
    const { title, children, type, inverse, space } = item
    space && console.log('')
    if (title) {
        const tit = inverse ? chalk.green.inverse(title) : chalk.gray(title)
        console.log(' '.repeat(indent * INDENT_UNIT) + tit)
    }
    type && Printer[type](item, indent, excludes)
    children && iterateList(children, indent + 1, excludes)
}

module.exports = {
    holdStrLen,
    fillStr: holdStrLen,
    Printer,
    iterateList,
    iterateItem
}