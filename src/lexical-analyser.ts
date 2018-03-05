
import { Type, WHITESPACE, PUNCTUATION, RESERVED, TYPES } from './types'
import { logToken } from './debug-print'

import fs = require('fs')
import { getMaxListeners } from 'cluster'

let content: string[]
let currentCharacterIndex: number = 0

/**
 * Parses file using lexical analysis.
 * @param filePath File to read.
 * @param debug Print debug messages.
 */
export function readFile(filePath: string, debug: boolean = false): Token[] {
    content = fs.readFileSync(filePath, 'utf8').split('')

    let tempToken: Token = undefined
    let tokens: Token[] = new Array()
    
    while (currentCharacterIndex < content.length) {
        /* Parse character */
        tempToken = read()
        tokens.push(tempToken)

        /* Debug print */
        if (debug) {
            logToken(tempToken)
        }
    }

    return tokens
}





/** 
 * Parses character and returns its lexical Token. 
 * 
 * @returns
 */
function read(): Token {

    /* Skip line comments */
    if (getCurrentCharacter() == PUNCTUATION['FWDSLASH'] && peekNextCharacter() == PUNCTUATION['FWDSLASH']) {
        skipUntil(WHITESPACE['NEWLINE'])
        return readNext()
    }

    /* Skip block comments */
    if (getCurrentCharacter() == PUNCTUATION['FWDSLASH'] && peekNextCharacter() == PUNCTUATION['ASTERISK']) {
        while (peekNextCharacter() != PUNCTUATION['FWDSLASH']) {
            nextCharacter()
            skipUntil(PUNCTUATION['ASTERISK'])
        }
        nextCharacter()
        return readNext()
    }

    /* Skip whitespace */
    if (isMapped(WHITESPACE, getCurrentCharacter())) {
        return readNext()
    }

    /* Read strings */
    if (getCurrentCharacter() == PUNCTUATION['SINGLE_QUOTE']) {
        nextCharacter()
        let string: string = skipUntil(PUNCTUATION['SINGLE_QUOTE'])
        nextCharacter()
        
        return createToken(
            Type.CONSTANT,
            TYPES.string,
            string
        )
    } 

    else if (getCurrentCharacter() == PUNCTUATION['DOUBLE_QUOTE']) {
        nextCharacter()
        let string: string = skipUntil(PUNCTUATION['DOUBLE_QUOTE'])
        nextCharacter()

        return createToken(
            Type.CONSTANT,
            TYPES['STRING'],
            string
        )
    }

    let token: Token

    /* Parse double punctuation */
    if (getCurrentCharacter() == PUNCTUATION['PLUS'] && peekNextCharacter() == PUNCTUATION['PLUS']) {
        nextCharacter()
        nextCharacter()
        return createToken(
            Type.PUNCTUATION, 'INCREMENT', PUNCTUATION['INCREMENT']
        )
    }
    if (getCurrentCharacter() == PUNCTUATION['MINUS'] && peekNextCharacter() == PUNCTUATION['MINUS']) {
        nextCharacter()
        nextCharacter()
        return createToken(
            Type.PUNCTUATION, 'DECREMENT', PUNCTUATION['DECREMENT']
        )
    }

    /* Parse single punctuation */
    let tempKey = getKey(PUNCTUATION, getCurrentCharacter())
    if (tempKey != null) {
        token = createToken(Type.PUNCTUATION, tempKey, PUNCTUATION[tempKey])
        nextCharacter()
    }

    /* Parse words */
    else {
        token = readNextWord()
    }

    return token

}

/** Increments current character index and reads character. */
function readNext(): Token {
    nextCharacter()
    return read()
}

/** 
 * 
 * @returns
 */
function readNextWord(): Token {
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

    let reservedKey: string = getKey(RESERVED, word)
    let typeKey: string = getKey(TYPES, word)

    /* Reserved word */
    if (reservedKey != null) {   
        token = createToken(Type.RESERVED, reservedKey, word)
    }

    else if (typeKey != null) {   
        token = createToken(Type.TYPE, typeKey, word)
    }

    /* Constant */
    else if (!isNaN(Number(word))) {
        token = createToken(Type.CONSTANT, TYPES['NUMBER'], word)
    }

    /* Identifier */
    else {
        token = createToken(Type.IDENTIFIER, word, word)
    }

    nextCharacter()

    return token
}



/**
 * Creates and returns Token
 * @param type Type of Token
 * @param name Name of Token
 * @param lexeme Lexim the Token was read from
 * @param location SourcePos in source file
 */
function createToken(type: Type, name: string, lexeme: string): Token {
    let location: number = getCurrentCharacterIndex()

    let position: SourcePos = getSourcePos(location)

    return {
        'type':         type,
        'name':         name,
        'lexeme':       lexeme,
        'location':     position
    }
}

/**
 * Returns line number
 * @param position 
 */
function getSourcePos(position: number): SourcePos {
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

    return { 'h': chars, 'v': lines }
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
function skipUntil(target: string): string {
    let text: string = ""
    while (getCurrentCharacter() != target) {
        text += getCurrentCharacter()
        nextCharacter()
    }
    return text
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
