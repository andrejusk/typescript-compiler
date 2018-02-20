/* 
 * Tokens 
 */

class Token {
    name
    lexim
    value
}

interface SymbolMap {
    [name: string]: string
}

const WHITESPACE: SymbolMap = {
    'SPACE':        ' ',
    'RETURN':       '\r',
    'NEWLINE':      '\n',
    'TAB':          '\t',
    'V_TAB':        '\v',
    'BACKSPACE':    '\b',
    'FORM_FEED':    '\f',
    'EOF':          '\0'
}

const PUNCTUATION: SymbolMap = {
    'COMMA':                    ',',
    'COLON':                    ':',
    'SEIMCOLON':                ';',
    'DOT':                      '.',
    'SINGLE_QUOTE':             '\'',
    'DOUBLE_QUOTE':             '.',
    'BACKSLASH':                '\\',
    'FORWARDSLASH':             '/',
    'ASTERISK':                 '*',
    'EXCLAMATION':              '!',
    'AMPERSAND':                '&',
    'EQUALS':                   '=',
    'PLUS':                     '+',
    'MINUS':                    '-',  
    'OPEN_PARENTHESIS':         '(',
    'CLOSE_PARENTHESIS':        ')',
    'OPEN_CURLY_BRACKET':       '{',
    'CLOSE_CURLY_BRACKET':      '}',
    'OPEN_ANGLE_BRACKET':       '<',
    'CLOSE_ANGLE_BRACKET':      '>',
    'OPEN_SQUARE_BRACKET':      '[',
    'CLOSE_SQUARE_BRACKET':     ']'
}

/**
 * Returns whether map contains term.
 * @param map Map to search.
 * @param term Term to look for.
 */
function searchMap(map: SymbolMap, term: string): boolean {
    for (let key in map) {
        if (map[key] == term) {
            return true;
        }
    }
    return false;
}

/**
 * Returns term's key in map. Null if doesn't exist.
 * @param map Map to search.
 * @param term Term to look for.
 */
function getKey(map: SymbolMap, term: string): string {
    for (let key in map) {
        if (map[key] == term) {
            return key;
        }
    }
    return null;
}

enum TOKEN_ID {

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

let debugFlag

let content
let currentCharacterIndex: number = 0

/**
 * Parses file using lexical analysis.
 * @param filePath File to parse.
 * @param debug Print debug messages.
 */
export function parseFile(filePath, debug: boolean = false) {
    debugFlag = debug

    let rawContent = fs.readFileSync(filePath, 'utf8')
    content = rawContent.split('')

    let tokens = new Array()
    
    while (true) {
        /* Parse character */
        tokens.push(parseCharacter())
        /* EOF */
        if (currentCharacterIndex >= content.length) {
            break;
        }
    }

    return tokens
}

/**
 * Increments current character index and parses character.
 */
function parseNextCharacter(): Token {
    nextCharacter()
    return parseCharacter()
}

/**
 * Parses character and returns its lexical token.
 */
function parseCharacter(): Token {
    /* Skip whitespace */
    let tempKey = getKey(WHITESPACE, getCurrentCharacter())
    if (tempKey != null) {
        logWhitespace(tempKey)
        return parseNextCharacter()
    }

    /* Skip line comments */
    if (getCurrentCharacter() == PUNCTUATION['FORWARDSLASH'] && peekNextCharacter() == PUNCTUATION['FORWARDSLASH']) {
        skipUntil(WHITESPACE['NEWLINE'])
        return parseNextCharacter()
    }
    /* Skip block comments */
    if (getCurrentCharacter() == PUNCTUATION['FORWARDSLASH'] && peekNextCharacter() == PUNCTUATION['ASTERISK']) {
        while (peekNextCharacter() != PUNCTUATION['FORWARDSLASH']) {
            nextCharacter()
            skipUntil(PUNCTUATION['ASTERISK'])
        }
        nextCharacter()
        return parseNextCharacter()
    }

    /* Parse punctuation */
    tempKey = getKey(PUNCTUATION, getCurrentCharacter())
    if (tempKey != null) {
        logPunctuation(tempKey)
        nextCharacter()
        return { 'name': tempKey, 'lexim': PUNCTUATION[tempKey], 'value': undefined }
    }

    logCharacter()
    nextCharacter()

    return { 'name': undefined, 'lexim': getCurrentCharacter(), 'value': undefined }
}



/* 
 * Debug print functions 
 */ 

/**
 * Logs current character as whitespace.
 * @param key Key to log as.
 */
function logWhitespace(key) {
    if (!debugFlag) {
        return
    }
    console.log(colors.yellow('[DEBUG] ') + colors.blue(key) + ' at ' + colors.yellow(getCurrentCharacterIndex()))
}

/**
 * Logs current character as punctuation.
 * @param key Key to log as.
 */
function logPunctuation(key) {
    if (!debugFlag) { 
        return
    }
    console.log(colors.yellow('[DEBUG] ') + colors.cyan(key) + ' at ' + colors.yellow(getCurrentCharacterIndex()))
}

/**
 * Logs current character information to console.
 * Only works if debug flag is set to 1.
 */
function logCharacter() {
    if (!debugFlag) {
        return
    }
    console.log(
        colors.yellow('[DEBUG] ') 
        + 'Character at ' 
        + colors.yellow(getCurrentCharacterIndex()) 
        + ': ' 
        + colors.green(getCurrentCharacter())
        + ' ['
        + colors.magenta(getCurrentCharacter().charCodeAt(0))
        + ']'
    )
}



/* 
 * Helper functions 
 */

/**
 * Increments current index.
 */
function nextCharacter() {
    currentCharacterIndex++
}

/**
 * Returns current index.
 */
function getCurrentCharacterIndex(): number {
    return currentCharacterIndex
}

/**
 * Returns current character in file.
 */
function getCurrentCharacter(): string {
    return content[currentCharacterIndex]
}

/**
 * Returns next character in file.
 */
function peekNextCharacter(): string {
    return content[currentCharacterIndex + 1]
}

/**
 * Moves index to next occurance of target.
 * @param target Character to look for.
 */
function skipUntil(target: string) {
    while (getCurrentCharacter() != target) {
        nextCharacter()
    }
}