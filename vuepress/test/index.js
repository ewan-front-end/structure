const {PATH_DATA, LAYOUT_NAV} = require('../.data/index')
const ARG_ARR = process.argv.slice(2)

ARG_ARR.includes('PATH_DATA') && console.log('DATA: PATH_DATA', PATH_DATA)
ARG_ARR.includes('LAYOUT_NAV') && console.log('DATA: LAYOUT_NAV', LAYOUT_NAV)