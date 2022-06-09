const Path = require('path')
const { writeFile } = require('../.utils/src/fs.js')    
const content = `
demo
`
writeFile(Path.resolve(__dirname, 'data/projects/demo.md'), content)
    
   
