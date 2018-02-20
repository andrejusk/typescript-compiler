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
    logInfo('Opened ' + filePath)

    logInfo('Running lexical analyser')
    let tokens = lex.parseFile(filePath, true)

    logInfo('Running parser')
} catch (e) {
    /* If incorrect */
    console.log("Usage: ts-node index.js <file>")
    logError(e)
}

function logInfo(message: string) {
    console.log(colors.blue('[INFO] ') + message)
}

function logError(message: string) {
    console.log(colors.red(message))
}