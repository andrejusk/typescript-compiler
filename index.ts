
import fs = require('fs')
import rimraf = require('rimraf')
import process = require('process')

import { logError, logInfo } from './src/debug-print'
import lex = require('./src/lexical-analyser')
import parser = require('./src/parser')
import compiler = require('./src/compiler')
import optimiser = require('./src/optimiser')
import child_process = require('child_process')

const tempFolder = `.\\tmp-${process.pid}\\`
const tempSource = 'compiled.c'
const tempCompiled = 'compiled.exe'

const gccDir = 'C:\\MinGW\\bin\\'
const gcc = 'g++.exe'
const compile = `${gccDir}${gcc} ${tempFolder}${tempSource} -o ${tempFolder}${tempCompiled}`

/* <command> <app> <target file> <debug> */
let filePath: string = (process.argv.length > 1) ? process.argv[2] : null

const debug = (process.argv.length > 2) ? (process.argv[3] == "--debug") : false

let log = (message: string) => {
    if (debug) {
        logInfo(message)
    }
}

try {
    /* Open file */
    log(`Opening ${filePath}...`)
    fs.readFileSync(filePath, 'utf8')

    /* Get tokens */
    log('Running lexical analyser...')
    let tokens: Token[] = lex.readFile(filePath, debug)

    /* Parse tokens into tree */
    log('Running parser...')
    let syntaxTree: SyntaxTree = parser.parseTokens(tokens, debug)

    /* Optmise tree */
    log('Running optimiser...')
    let optimisedTree: SyntaxTree = optimiser.optimise(syntaxTree, debug)

    /* Compile C code from tree */
    log('Running compiler...')
    let code: string = compiler.compile(optimisedTree)
    log(`Compiled code: \n${code}`)

    /* Write C code to file */
    log('Saving compiled code...')
    if (!fs.existsSync(tempFolder)) {
        fs.mkdirSync(tempFolder)
    }
    fs.writeFileSync(`${tempFolder}${tempSource}`, code)
    
    /* Compile C code */
    log('Making executable...')
    child_process.execSync(compile)

    /* Execute compiled code */
    log('Running executable...')
    let returned: Buffer = child_process.execFileSync(`${tempFolder}${tempCompiled}`)
    console.log(returned.toString())

} catch (e) {
    logError(e)
    if (debug) {
        logError(`Stack: ${(<Error>e).stack}`)
    }
}

/* Cleanup */
log('Deleting temporary files...')
rimraf(tempFolder, () => {
    log('Done!')
})
