/** Lexim types */
enum Type {
    'WHITESPACE',
    'PUNCTUATION',
    'IDENTIFIER',
    'CONSTANT',
    'RESERVED'
}

/** Abbereviated lexim types */
enum Type_abbr {
    'WHITE',
    'PUNCT',
    'IDENT',
    'CONST',
    'RESER'
}


/** Token class, value and lexim optional */
class Token {
    type: Type
    name: string
    lexim?: string
    value?: number
    location: number
}

/** Symbol to name mapping */
interface SymbolMap {
    [name: string]: string
}

/** WHITE - Whitespace */
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

/** PUNCT - Punctuation */
const PUNCTUATION: SymbolMap = {
    'COMMA':                    ',',
    'COLON':                    ':',
    'SEIMCOLON':                ';',
    'DOT':                      '.',
    'SINGLE_QUOTE':             '\'',
    'DOUBLE_QUOTE':             '.',
    'BACKSLASH':                '\\',
    'FWDSLASH':             '/',
    'ASTERISK':                 '*',
    'EXCLAMATION':              '!',
    'AMPERSAND':                '&',
    'EQUALS':                   '=',
    'PLUS':                     '+',
    'MINUS':                    '-',  
    'O_PAR':         '(',
    'C_PAR':        ')',
    'O_CUR_BR':       '{',
    'C_CUR_BR':      '}',
    'O_ANG_BR':       '<',
    'C_ANG_BR':      '>',
    'O_SQR_BR':      '[',
    'C_SQR_BR':     ']'
}

/** IDENT - Identifier */
const IDENTIFIER = 'IDENTIFIER'

/** CONST - Constant */
const CONSTANT = 'CONSTANT'

/** RESER - Reserved */
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

/** 
 * Parses character and returns its lexical token. 
 * 
 * @returns
 */
function parseCharacter(): Token {

    /* Skip line comments */
    if (getCurrentCharacter() == PUNCTUATION['FWDSLASH'] && peekNextCharacter() == PUNCTUATION['FWDSLASH']) {
        skipUntil(WHITESPACE['NEWLINE'])
        return parseNextCharacter()
    }

    /* Skip block comments */
    if (getCurrentCharacter() == PUNCTUATION['FWDSLASH'] && peekNextCharacter() == PUNCTUATION['ASTERISK']) {
        while (peekNextCharacter() != PUNCTUATION['FWDSLASH']) {
            nextCharacter()
            skipUntil(PUNCTUATION['ASTERISK'])
        }
        nextCharacter()
        return parseNextCharacter()
    }

    /* Skip whitespace */
    if (isMapped(WHITESPACE, getCurrentCharacter())) {
        return parseNextCharacter()
    }

    let token: Token

    /* Parse punctuation */
    let tempKey = getKey(PUNCTUATION, getCurrentCharacter())
    if (tempKey != null) {
        token = { 'type': Type.PUNCTUATION, 'name': tempKey, 'lexim': PUNCTUATION[tempKey], 'value': null, 'location': getCurrentCharacterIndex() }
        nextCharacter()
    }

    /* Parse words */
    else {
        token = parseNextWord()
    }

    log(token)

    return token

}


/* 
 * Helper functions 
 */

/** 
 * 
 * 
 * @returns
 */
function parseNextWord(): Token {
    let word: string = ''
    let token: Token

    /* Find next break */
    let tempIndex: number = getCurrentCharacterIndex()
    let tempCharacter: string = getCharacter(tempIndex)

    while(!isMapped(WHITESPACE, tempCharacter) && !isMapped(PUNCTUATION, tempCharacter)) {
        word += tempCharacter
        //todo: check EOF
        tempCharacter = getCharacter(++tempIndex)
    }

    let key = getKey(RESERVED, word)

    /* Reserved word */
    if (key != null) {   
        token = { 'type': Type.RESERVED, 'name': key, 'lexim': word, 'value': null, 'location': getCurrentCharacterIndex() }
    }
    /* Constant */
    else if (!isNaN(Number(word))) {
        token = { 'type': Type.CONSTANT, 'name': word, 'lexim': word, 'value': Number(word), 'location': getCurrentCharacterIndex() }    
    }
    /* Identifier */
    else {
        token = { 'type': Type.IDENTIFIER, 'name': word, 'lexim': word, 'value': null, 'location': getCurrentCharacterIndex() }
    }

    setCurrentCharacterIndex(tempIndex)

    return token

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



/** Debug print function */ 
function log(token: Token) {
    if (!debugFlag) {
        return
    }

    console.log(
        colors.yellow(`[${Type_abbr[token.type]}] `) +
        colors.cyan(`${token.name}\t`) +
        `at ` +
        colors.yellow(`${token.location}`) +
        `\t(line ` +
        colors.yellow(`${getLine(token.location)}`) +
        `)`
    )

}

//TODO: put into class
/**
 * Returns line number
 * @param position 
 */
function getLine(position: number) {

    let lines: number = 1
    let iterator: number = 0

    while (iterator < position) {
        if (getCharacter(iterator) == WHITESPACE.NEWLINE) {
            lines++
        }
        iterator++
    }

    return lines

}