import fs = require('fs')
import colors = require('colors/safe')

import lex = require('./src/lexical-analyser')
import parser = require('./src/parser')

/* <command> <app> <target file> */
let filePath: string = (process.argv.length > 1) ? process.argv[2] : null

try {
    /* Open file */
    fs.readFileSync(filePath, 'utf8')
    logInfo(`Opened ${filePath}`)

    /* Run lex */
    logInfo('Running lexical analyser')
    let tokens: Token[] = lex.parseFile(filePath, true)

    /* Parse tokens */
    logInfo('Running parser')
    let tac: Procedure[] = parser.parseTokens(tokens, true)

    /* Compile */
    logInfo('Running compiler')
    console.log()

} catch (e) {

    /* Incorrect usage */
    console.log("Usage: ts-node index.js <file>")
    logError((<Error>e).stack)

}



function logInfo(message: string) {
    console.log(colors.blue('[INFO] ') + message)
}

function logError(message: string) {
    console.log(colors.red(message))
}