import fs = require('fs')
import lex = require('./src/lexical-analyser')
import colors = require('colors/safe')

let filePath = undefined;

/* <command> <app> <target file> */
if (process.argv.length > 1) {
    filePath = process.argv[2]
}

try {
    fs.readFileSync(filePath, 'utf8')
    lex.parseFile(filePath)
} catch (e) {
    /* If incorrect */
    //console.log("Usage: ts-node index.js <file>")
    console.log(colors.red(e))
}