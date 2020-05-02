const { readFileSync, writeFileSync } = require('fs')

const templateHtml = readFileSync('./template.html', 'utf8')
const mainJs = readFileSync('./build/main.js', 'utf8')

writeFileSync('index.html', templateHtml.replace(`/* build/main.js */`, mainJs))
