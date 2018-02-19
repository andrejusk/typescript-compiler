/* 
    Tokens 
*/

class Token {
    type
    lexim
    value
}

let WHITESPACE: Token[] = [
    { 'type': 'SPACE',      'lexim': ' ',   'value': null },
    { 'type': 'NEWLINE',    'lexim': '\n',  'value': null },
    { 'type': 'TAB',        'lexim': '\t',  'value': null }
]

let PUNCTUATION: Token[] = [
    { 'type': 'COMMA',          'lexim': ',',   'value': null },
    { 'type': 'COLON',          'lexim': ':',   'value': null },
    { 'type': 'SEIMCOLON',      'lexim': ';',   'value': null },
    { 'type': 'DOT',            'lexim': '.',   'value': null },
    { 'type': 'SINGLE_QUOTE',   'lexim': '\'',  'value': null },
    { 'type': 'DOUBLE_QUOTE',   'lexim': '.',   'value': null },
    { 'type': 'BACKSLASH',      'lexim': '\\',  'value': null },
    { 'type': 'FORWARDSLASH',   'lexim': '/',   'value': null },
    { 'type': 'ASTERISK',       'lexim': '*',   'value': null },
    { 'type': 'EXCLAMATION',    'lexim': '!',   'value': null },
    { 'type': 'AMPERSAND',      'lexim': '&',   'value': null }
]

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
    let tempCharacter = content[currentCharacter]

    switch (tempCharacter) {
        case ' ': {
            tempCharacter = 'SPACE'
            break
        }
        case '\n': {
            tempCharacter = 'NEWLINE'
            break
        }
        case '\t': {
            tempCharacter = 'TAB'
            break
        }
    }

    console.log(colors.yellow('[DEBUG]') + ' Character at ' + colors.yellow(currentCharacter) + ': ' + colors.grey(tempCharacter))

    //Check if parsed
    if (true) {
        currentCharacter++
    }

    return { 'type': undefined, 'lexim': undefined, 'value': undefined }
}

function peekCharacter() {

}