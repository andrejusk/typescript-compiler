/* 
    Tokens 
*/

class Token {
    lexim
    value
}

interface SymbolMap {
    [name: string]: string
}

const WHITESPACE: SymbolMap = {
    'SPACE':    ' ',
    'NEWLINE':  '\n',
    'TAB':      '\t'
}

function mapContains(map: SymbolMap, term: string): boolean {
    for (let key in map) {
        if (map[key].indexOf(term) != -1) {
            return true;
        }
    }
    return false;
}

/*
let PUNCTUATION: Token[] = [
    { 'name': 'COMMA',          'lexim': ',',   'value': null },
    { 'name': 'COLON',          'lexim': ':',   'value': null },
    { 'name': 'SEIMCOLON',      'lexim': ';',   'value': null },
    { 'name': 'DOT',            'lexim': '.',   'value': null },
    { 'name': 'SINGLE_QUOTE',   'lexim': '\'',  'value': null },
    { 'name': 'DOUBLE_QUOTE',   'lexim': '.',   'value': null },
    { 'name': 'BACKSLASH',      'lexim': '\\',  'value': null },
    { 'name': 'FORWARDSLASH',   'lexim': '/',   'value': null },
    { 'name': 'ASTERISK',       'lexim': '*',   'value': null },
    { 'name': 'EXCLAMATION',    'lexim': '!',   'value': null },
    { 'name': 'AMPERSAND',      'lexim': '&',   'value': null }
]
*/

enum TOKEN_ID {

    /* Punctuation */

    /* Arithmetic */
    EQUALS = '=',
    PLUS = '+',

    /* Brackets */
    OPEN_PARENTHESIS = '(',
    CLOSE_PARENTHESIS = ')',
    OPEN_CURLY_BRACKET = '{',
    CLOSE_CURLY_BRACKET = '}',
    OPEN_ANGLE_BRACKET = '<',
    CLOSE_ANGLE_BRACKET = '>',
    OPEN_SQUARE_BRACKET = '[',
    CLOSE_SQUARE_BRACKET = ']',

    /* Keywords */
    LET = 'let',

    /* Variable objects */
    NUMBER = 'number',

    /* Reserved statements */
    PRINT = 'console.log',

    UNKNOWN = -1
}



import fs = require('fs')
import colors = require('colors/safe')

let content
let currentCharacter: number = 0

export function parseFile(filePath) {
    let rawContent = fs.readFileSync(filePath, 'utf8')

    console.log(colors.blue('[INFO]') + ' Opened ' + filePath)
    console.log(colors.yellow('[DEBUG]') + ' Contents:\n' + colors.grey(rawContent))

    content = rawContent.split('')

    console.log(colors.blue('[INFO]') + ' Running lexical analyser')

    let tempToken: Token
    
    while (true) {
        tempToken = parseCharacter()
        if (currentCharacter >= content.length) {
            break;
        }
    }
    
    
}

function parseCharacter(): Token {
    /* Get character */
    let tempCharacter = content[currentCharacter]

    /* Skip white space */
    if (mapContains(WHITESPACE, tempCharacter)) {
        currentCharacter++
        return parseCharacter()
    }
    
    //Skip comments
    //Pass EOF
    
    console.log(colors.yellow('[DEBUG]') + ' Character at ' + colors.yellow(currentCharacter) + ': ' + colors.grey(tempCharacter))
    //Check if parsed
    currentCharacter++

    return { 'lexim': undefined, 'value': undefined }
}

function peekCharacter() {

}