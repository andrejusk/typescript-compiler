/* 
    Tokens 
*/

enum TOKEN_ID {
    /* Punctuation */
    COMMA = ',',
    COLON = ':',
    SEIMCOLON = ';',
    DOT = '.',
    SINGLE_QUOTE = '\'',
    DOUBLE_QUOTE = '.',
    BACKSLASH = '\\',
    FORWARDSLASH = '/',
    ASTERISK = '*',
    EXCLAMATION = '!',
    AMPERSAND = '&',

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
    PRINT = 'console.log'

}



//rethink token
class Token {
    ID: TOKEN_ID
    lexim
    value
}



import fs = require('fs')
import colors = require('colors/safe')

let currentCharacter: number = 0

export function parseFile(filePath) {
    let contents = fs.readFileSync(filePath, 'utf8')
    console.log(colors.blue('[INFO]') + ' Opened ' + filePath)
    console.log(colors.yellow('[DEBUG]') + ' Contents:\n' + colors.grey(contents))
    console.log(colors.blue('[INFO]') + ' Running lexical analyser')

    let tempToken: Token
    /*
    while (true) {
        tempToken = parseCharacter()
    }
    */
    
}

function parseCharacter(character) {

}

function peekCharacter() {

}