
import { logToken, logTree } from './debug-print'
import { Type, RESERVED, PUNCTUATION } from './types';
import { create } from 'domain';

let tokens: Token[]
let currentIndex: number = 0

/**
 * Parses tokens.
 * @param lex Tokens to parse.
 * @param debug Print debug messages.
 */
export function parseTokens(lex: Token[], debug: boolean) {
    tokens = lex

    let tempNode: SyntaxTree
    let root: SyntaxTree = undefined

    while (currentIndex < tokens.length) {
        /* Parse token */
        tempNode = parse()

        if (root == undefined) {
            /* Create empty root */
            root = createEmptyTree()       
        } else if (root.argument2 == undefined) {
            /* Fill root */
            root.argument2 = tempNode
            /* Copy root */
            tempNode = root
            /* Create empty root */
            root = createEmptyTree()
        }

        /* Add child node */
        root.argument1 = tempNode
    }

    /* Debug print */
    if (debug) {
        logTree(root)
    }

    return root
}

function createEmptyTree(): SyntaxTree {
    return { 
        content: { 
            type: Type.SEQUENCE, 
            name: 'SEQUENCE', 
            lexeme: null, 
            location: null 
        }, 
        argument1: undefined,
        argument2: undefined
    }
}



function parse(): SyntaxTree {

    /* Variable declaration */
    if (getCurrentToken().lexeme == RESERVED['LET']) {
        return parseDeclaration()
    }

    /* Console log */
    else if (getCurrentToken().lexeme == RESERVED['CONSOLE']) {
        return parsePrint()
    }

    /* Parse expression */
    else {
        return parseExpression()
    }
    
}

/** 
 * Declaration parser
 * 
 * 0   1 2 3       4 5
 * let a : number (= 10)
 * 
 *    3 declare/(assign) type
 * 1 ident             5 (value)
 */
function parseDeclaration(): SyntaxTree {

    /* Sanity check colon */
    if (getToken(currentIndex + 2).lexeme != ":") {
        throw `Expected ':' at ${getToken(currentIndex + 1).location.v + 1}:${getToken(currentIndex + 1).location.h + 1}`
    }

    let skipAhead: number

    let identifier: Token = getToken(currentIndex + 1)
    let type: Token = getToken(currentIndex + 3)
    let value: SyntaxTree

    /* Assign operator */
    if (getToken(currentIndex + 4).lexeme == PUNCTUATION['EQUALS']) {
        type.name = `ASSIGN ${type.name}`
        value = { content: getToken(currentIndex + 5) }
        skipAhead = 6
    } else {
        type.name = `DECLARE ${type.name}`
        value = null
        skipAhead = 4
    }

    currentIndex += skipAhead

    return {
        content: type,
        argument1: { content: identifier },
        argument2: value
    }

}

/** 
 * 0      12  345
 * console.log(a)
 * 
 *      2 log
 * 4 ident
 */
function parsePrint(): SyntaxTree {

    /* Sanity check dot */
    if (getToken(currentIndex + 1).lexeme != ".") {
        throw `Expected '.' at ${getToken(currentIndex).location.v + 1}:${getToken(currentIndex).location.h + 1}`
    }
    /* Sanity check log function */
    if (getToken(currentIndex + 2).lexeme != "log") {
        throw `Expected 'log' at ${getToken(currentIndex + 1).location.v + 1}:${getToken(currentIndex + 1).location.h + 1}`
    }
    /* Sanity check parenthesis */
    if (getToken(currentIndex + 3).lexeme != "(") {
        throw `Expected '(' at ${getToken(currentIndex + 2).location.v + 1}:${getToken(currentIndex + 2).location.h + 1}`
    }
    /* Sanity check parenthesis */
    if (getToken(currentIndex + 5).lexeme != ")") {
        throw `Expected ')' at ${getToken(currentIndex + 4).location.v + 1}:${getToken(currentIndex + 4).location.h + 1}`
    }

    let action: Token = getToken(currentIndex + 2)
    let identifier: Token = getToken(currentIndex + 4)
    currentIndex += 6
    return {
        content: action,
        argument1: { content: identifier }
    }

}


/** 
 * 0 1 2 3 4
 * a = b + c
*/
function parseExpression(): SyntaxTree {

    /* Sanity check equals sign */
    if (getToken(currentIndex + 1).lexeme != "=") {
        throw `Expected '=' at ${getToken(currentIndex).location.v + 1}:${getToken(currentIndex).location.h + 1}`
    }

    let result: Token = getToken(currentIndex)
    let address1: Token = getToken(currentIndex + 2)
    let operation: Token = getToken(currentIndex + 3)
    let address2: Token = getToken(currentIndex + 4)

    currentIndex += 5

    return {
        content: operation,
        argument1: { content: address1 },
        argument2: { content: address2 }
    }

}



function consume(number: number) {
    let index: number = 0
    while (index < number) {
        index++
        currentIndex++
    }
}



function getToken(index: number): Token {
    return tokens[index]
}

function getCurrentToken(): Token {
    return getToken(currentIndex)
}
