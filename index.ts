import fs = require('fs')
import lex = require('./src/lexical-analyser')
import colors = require('colors/safe')

let filePath = undefined

console.log()

/* <command> <app> <target file> */
if (process.argv.length > 1) {
    filePath = process.argv[2]
}

try {

    /* Open file */
    fs.readFileSync(filePath, 'utf8')
    logInfo(`Opened ${filePath}`)

    /* Run lex */
    logInfo('Running lexical analyser')
    let tokens = lex.parseFile(filePath, true)

    /* Parse tokens */
    logInfo('Running parser')


    /* Compile */
    logInfo('Running compiler')
    

} catch (e) {
    /* Incorrect usage */
    console.log("Usage: ts-node index.js <file>")
    logError(e)
}

function logInfo(message: string) {
    console.log(colors.blue('[INFO] ') + message)
}

function logError(message: string) {
    console.log(colors.red(message))
}

console.log()