/* 
    Tokens 
*/

/* Punctuation */
let COMMA = ','
let COLON = ':'
let SEIMCOLON = ';'
let DOT = '.'
let SINGLE_QUOTE = '\''
let DOUBLE_QUOTE = '.'
let BACKSLASH = '\\'
let FORWARDSLASH = '/'
let ASTERISK = '*'
let EXCLAMATION = '!'
let AMPERSAND = '&'

/* Arithmetic */
let EQUALS = '='
let PLUS = '+'

/* Brackets */
let OPEN_PARENTHESIS = '('
let CLOSE_PARENTHESIS = ')'
let OPEN_CURLY_BRACKET = '{'
let CLOSE_CURLY_BRACKET = '}'
let OPEN_ANGLE_BRACKET = '<'
let CLOSE_ANGLE_BRACKET = '>'
let OPEN_SQUARE_BRACKET = '['
let CLOSE_SQUARE_BRACKET = ']'

/* Keywords */
let LET = 'let'

/* Variable objects */
let NUMBER = 'number'

import fs = require('fs')

export function analyse(filePath) {
    fs.readFileSync(filePath, 'utf8')

    
}