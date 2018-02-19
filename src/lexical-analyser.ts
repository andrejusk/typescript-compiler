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




class Token {
    ID: TOKEN_ID
    value
}



import fs = require('fs')

export function analyse(filePath) {
    fs.readFileSync(filePath, 'utf8')

    
}