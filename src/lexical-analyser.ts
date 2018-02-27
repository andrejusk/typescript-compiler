
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
    lexim: string
    value: number
    v_location: number
    h_location: number
}

/** Position class, holds vertical and horizontal character values */
class Position {
    v_location: number
    h_location: number
}

/**
 * Creates and returns Token
 * @param type Type of Token
 * @param name Name of Token
 * @param lexim Lexim the Token was parsed from
 * @param location Location in source file
 */
function createToken(type: Type, name: string, lexim: string): Token {

    let location = getCurrentCharacterIndex()

    let position: Position = getLocation(location)

    let v_location: number = position.v_location
    let h_location: number = position.h_location

    let value = undefined

    if (type == Type.CONSTANT) {
        value = Number(lexim)
        lexim = null
    } else {
        value = null
    }

    return {
        'type':         type,
        'name':         name,
        'lexim':        lexim,
        'value':        value,
        'v_location':   v_location,
        'h_location':   h_location,
    }

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
import { getMaxListeners } from 'cluster';

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

/**
 * Returns line number
 * @param position 
 */
function getLocation(position: number): Position {
    let lines: number = 1
    let chars: number = 1
    let iterator: number = 0

    while (iterator < position) {
        if (getCharacter(iterator) == WHITESPACE.NEWLINE) {
            chars = 1
            lines++
        }
        chars++
        iterator++
    }

    return { 'h_location': chars, 'v_location': lines }
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
        token = createToken(Type.PUNCTUATION, tempKey, PUNCTUATION[tempKey])
        nextCharacter()
    }

    /* Parse words */
    else {
        token = parseNextWord()
    }

    if (debugFlag) {
        log(token)
    }

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

    setCurrentCharacterIndex(--tempIndex)

    let key = getKey(RESERVED, word)

    /* Reserved word */
    if (key != null) {   
        token = createToken(Type.RESERVED, key, word)
    }

    /* Constant */
    else if (!isNaN(Number(word))) {
        token = createToken(Type.CONSTANT, word, word)
    }

    /* Identifier */
    else {
        token = createToken(Type.IDENTIFIER, word, word)
    }

    nextCharacter()

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

    let nameColor

    switch (token.type) {
        case Type.CONSTANT:
            nameColor = colors.green
            break;
        case Type.IDENTIFIER:
            nameColor = colors.cyan
            break;
        case Type.PUNCTUATION:
            nameColor = colors.white
            break;
        case Type.RESERVED:
            nameColor = colors.blue
            break;
        case Type.WHITESPACE:

        default:
            nameColor = colors.grey
            break;
    }

    console.log(
        `\t` +
        nameColor(`${token.name}\t`) +
        `at ` +
        colors.yellow(`${token.v_location}`) +
        `:` +
        colors.yellow(`${token.h_location}`)
    )

}
