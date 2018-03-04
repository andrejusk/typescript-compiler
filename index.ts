
import fs = require('fs')
import colors = require('colors/safe')

import { logError, logInfo, logCode } from './src/debug-print'
import lex = require('./src/lexical-analyser')
import parser = require('./src/parser')
import compiler = require('./src/compiler')
import optimiser = require('./src/optimiser')
import child_process = require('child_process');

const tempFolder = './tmp/'
const tempSource = 'compiled.c'
const tempCompiled = 'compiled.exe'

const compile = `g++ ${tempSource} -o ${tempCompiled}`

/* <command> <app> <target file> */
let filePath: string = (process.argv.length > 1) ? process.argv[2] : null

try {
    /* Open file */
    fs.readFileSync(filePath, 'utf8')
    logInfo(`Opened ${filePath}`)

    /* Run lex */
    logInfo('Running lexical analyser')
    let tokens: Token[] = lex.readFile(filePath)

    /* Parse tokens */
    logInfo('Running parser')
    let syntaxTree: SyntaxTree = parser.parseTokens(tokens)

    /* Optmise */
    logInfo('Running optimiser')
    let optimisedTree: SyntaxTree = optimiser.optimise(syntaxTree)

    /* Compile C code */
    logInfo('Running compiler')
    let code: string = compiler.compile(optimisedTree)

    /* Write C code to file */
    if (!fs.existsSync(tempFolder)) {
        fs.mkdirSync(tempFolder);
    }
    fs.writeFileSync(`${tempFolder}${tempSource}`, code)
    
    /* Compile C code */
    let returned = child_process.execSync(`g++ ${tempSource} -o ${tempCompiled}`)
    console.log(returned)

    /* Cleanup */
    //recursively remove ./tmp

} catch (e) {
    /* Incorrect usage */
    logInfo("Usage: ts-node index.js <file>")
    logError(e)
    logError(`Stack: ${(<Error>e).stack}`)
}

console.log()