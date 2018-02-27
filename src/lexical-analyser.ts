
/** Lexim types */
enum Type {
    'WHITESPACE',
    'PUNCTUATION',
    'IDENTIFIER',
    'CONSTANT',
    'RESERVED'
}

/** Abbereviated lexeme types */
enum TypeS {
    'WHITE',
    'PUNCT',
    'IDENT',
    'CONST',
    'RESER'
}



/** Token class, value and lexeme optional */
class Token {
    type: Type
    name: string
    lexeme: string
    value: number
    v_location: number
    h_location: number
}

/**
 * Creates and returns Token
 * @param type Type of Token
 * @param name Name of Token
 * @param lexeme Lexim the Token was parsed from
 * @param location Location in source file
 */
function createToken(type: Type, name: string, lexeme: string): Token {
    let location: number = getCurrentCharacterIndex()

    let position: Position = getLocation(location)
    let v_location: number = position.v_location
    let h_location: number = position.h_location

    let value: number = undefined

    if (type == Type.CONSTANT) {
        value = Number(lexeme)
        lexeme = null
    } else {
        value = null
    }

    return {
        'type':         type,
        'name':         name,
        'lexeme':       lexeme,
        'value':        value,
        'v_location':   v_location,
        'h_location':   h_location,
    }
}


/** Position class, holds vertical and horizontal character values */
class Position {
    v_location: number
    h_location: number
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
    'COMMA':        ',',
    'COLON':        ':',
    'SEIMCOLON':    ';',
    'DOT':          '.',
    'SINGLE_QUOTE': '\'',
    'DOUBLE_QUOTE': '.',
    'BACKSLASH':    '\\',
    'FWDSLASH':     '/',
    'ASTERISK':     '*',
    'EXCLAMATION':  '!',
    'AMPERSAND':    '&',
    'EQUALS':       '=',
    'PLUS':         '+',
    'MINUS':        '-',  
    'O_PAR':        '(',
    'C_PAR':        ')',
    'O_CUR_BR':     '{',
    'C_CUR_BR':     '}',
    'O_ANG_BR':     '<',
    'C_ANG_BR':     '>',
    'O_SQR_BR':     '[',
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
import { getMaxListeners } from 'cluster'

let debugFlag: boolean

let content: string[]
let currentCharacterIndex: number = 0

/**
 * Parses file using lexical analysis.
 * @param filePath File to parse.
 * @param debug Print debug messages.
 */
export function parseFile(filePath: string, debug: boolean = false): Token[] {
    debugFlag = debug

    content = fs.readFileSync(filePath, 'utf8').split('')

    let tokens: Token[] = new Array()
    
    while (true) {
        /* Parse character */
        tokens.push(parse())
        /* EOF */
        if (currentCharacterIndex >= content.length) {
            break
        }
    }

    return tokens
}





/** 
 * Parses character and returns its lexical Token. 
 * 
 * @returns
 */
function parse(): Token {

    /* Skip line comments */
    if (getCurrentCharacter() == PUNCTUATION['FWDSLASH'] && peekNextCharacter() == PUNCTUATION['FWDSLASH']) {
        skipUntil(WHITESPACE['NEWLINE'])
        return parseNext()
    }

    /* Skip block comments */
    if (getCurrentCharacter() == PUNCTUATION['FWDSLASH'] && peekNextCharacter() == PUNCTUATION['ASTERISK']) {
        while (peekNextCharacter() != PUNCTUATION['FWDSLASH']) {
            nextCharacter()
            skipUntil(PUNCTUATION['ASTERISK'])
        }
        nextCharacter()
        return parseNext()
    }

    /* Skip whitespace */
    if (isMapped(WHITESPACE, getCurrentCharacter())) {
        return parseNext()
    }

    let Token: Token

    /* Parse punctuation */
    let tempKey = getKey(PUNCTUATION, getCurrentCharacter())
    if (tempKey != null) {
        Token = createToken(Type.PUNCTUATION, tempKey, PUNCTUATION[tempKey])
        nextCharacter()
    }

    /* Parse words */
    else {
        Token = parseNextWord()
    }

    if (debugFlag) {
        log(Token)
    }

    return Token

}

/** Increments current character index and parses character. */
function parseNext(): Token {
    nextCharacter()
    return parse()
}

/** 
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
        
        /* EOF */
        if (tempIndex >= content.length) {
            break
        }

        tempCharacter = getCharacter(++tempIndex)
    }

    setCurrentCharacterIndex(--tempIndex)

    let key: string = getKey(RESERVED, word)

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





/* 
 * Helper functions 
 */

/** Returns current index. */
function getCurrentCharacterIndex(): number {
    return currentCharacterIndex
}

/** Sets current character in file. */
function setCurrentCharacterIndex(index: number): void {
    currentCharacterIndex = index
}

/** Increments current index. */
function nextCharacter(): void {
    return setCurrentCharacterIndex(getCurrentCharacterIndex() + 1)
}

/**
 * Moves index to next occurance of target.
 * @param target Character to look for.
 */
function skipUntil(target: string): void {
    while (getCurrentCharacter() != target) {
        return nextCharacter()
    }
}



/** Returns given character in file. */
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





/** Debug print function */ 
function log(Token: Token): void {
    let nameColor: colors

    switch (Token.type) {
        case Type.CONSTANT:
            nameColor = colors.green
            break
        case Type.IDENTIFIER:
            nameColor = colors.cyan
            break
        case Type.PUNCTUATION:
            nameColor = colors.white
            break
        case Type.RESERVED:
            nameColor = colors.blue
            break
        case Type.WHITESPACE:

        default:
            nameColor = colors.grey
            break
    }

    console.log(
        colors.blue(`  >>`) +
        colors.grey(`\t[`) +
        nameColor(`${TypeS[Token.type]}`) +
        colors.grey(`] `) +
        nameColor(`${Token.name}\t`) +
        colors.grey(`at `) +
        colors.yellow(`${Token.v_location}`) +
        `:` +
        colors.yellow(`${Token.h_location}`)
    )
}
