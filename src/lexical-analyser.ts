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

const IDENTIFIER = 'IDENTIFIER'

const CONSTANT = 'CONSTANT'

const RESERVED: SymbolMap = {
    'LET':                  'let',
    'NUMBER':               'number',
    'CONSOLE':              'console',
    'LOG':                  'log'
}

/**
 * Returns whether map contains term.
 * @param map Map to search.
 * @param term Term to look for.
 */
function isMapped(map: SymbolMap, term: string): boolean {
    return getKey(map, term) != null
}

/**
 * Returns term's key in map. Null if doesn't exist.
 * @param map Map to search.
 * @param term Term to look for.
 */
function getKey(map: SymbolMap, term: string): string {
    for (let key in map) {
        if (map[key] == term) {
            return key
        }
    }
    return null
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
            break
        }
    }

    return tokens
}



/** Increments current character index and parses character. */
function parseNextCharacter(): Token {
    nextCharacter()
    return parseCharacter()
}

/** Parses character and returns its lexical token. */
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

    let word: Token = parseNextWord()
    logWord(word.name, word.lexim)
    return word
}


/* 
 * Helper functions 
 */

/** 
 * 
 * @returns
 */
function parseNextWord(): Token {
    let word: string = ''

    /* Find next break */
    let tempIndex: number = getCurrentCharacterIndex()
    let tempCharacter: string = getCharacter(tempIndex)

    //console.log("checking if " + tempCharacter + " at " + tempIndex + " is whitespace or punctuation")

    while(!isMapped(WHITESPACE, tempCharacter) && !isMapped(PUNCTUATION, tempCharacter)) {
        word += tempCharacter
        //todo: check EOF
        tempCharacter = getCharacter(++tempIndex)
    }

    let key = getKey(RESERVED, word)
    setCurrentCharacterIndex(tempIndex)

    /* Reserved word */
    if (key != null) {   
        return { 'name': key, 'lexim': word, 'value': undefined }
    }
    /* Constant */
    else if (!isNaN(Number(word))) {
        return { 'name': CONSTANT, 'lexim': word, 'value': Number(word) }     
    }
    /* Identifier */
    else {
        return { 'name': IDENTIFIER, 'lexim': word, 'value': undefined }     
    }

}

/** Increments current index. */
function nextCharacter() {
    currentCharacterIndex++
}

/** Returns current index. */
function getCurrentCharacterIndex(): number {
    return currentCharacterIndex
}

function setCurrentCharacterIndex(index: number) {
    currentCharacterIndex = index
}

/** Returns current character in file. */
function getCharacter(characterIndex: number): string {
    return content[characterIndex]
}

/** Returns current character in file. */
function getCurrentCharacter(): string {
    return getCharacter(currentCharacterIndex)
}

/** Returns next character in file. */
function peekNextCharacter(): string {
    return getCharacter(currentCharacterIndex + 1)
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
 * Logs current character as punctuation.
 * @param key Key to log as.
 */
function logWord(key, lexim) {
    if (!debugFlag) { 
        return
    }
    console.log(colors.yellow('[DEBUG] ') + colors.green(key) + ' at ' + colors.yellow(getCurrentCharacterIndex()) + ": " + colors.grey(lexim))
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
