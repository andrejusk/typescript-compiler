
import { logToken, logTree } from './debug-print'
import { Type, RESERVED, PUNCTUATION } from './types';
import { create } from 'domain';

const DECLARE: Token = { 
    type: Type.DECLARE, 
    name: 'DECLARE', 
    lexeme: null, 
    location: null 
}

const DECLARE_ASSIGN: Token = { 
    type: Type.DECLARE_ASSIGN, 
    name: 'DECLARE_ASSIGN', 
    lexeme: null, 
    location: null 
}

const ASSIGN: Token = { 
    type: Type.ASSIGN, 
    name: 'ASSIGN', 
    lexeme: null, 
    location: null 
}

const SEQUENCE: Token = { 
    type: Type.SEQUENCE, 
    name: 'SEQUENCE', 
    lexeme: null, 
    location: null 
}

const VARIABLE: Token = { 
    type: Type.VARIABLE, 
    name: 'VARIABLE', 
    lexeme: null, 
    location: null 
}

const END: Token = { 
    type: Type.END, 
    name: 'END', 
    lexeme: null, 
    location: null 
}

let root: SyntaxTree = {
    content: SEQUENCE,
    argument1: { 
        content: {
            type: Type.START,
            name: 'START',
            lexeme: null,
            location: null
        }
    }
}

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

    while (currentIndex < tokens.length) {
        /* Parse token */
        tempNode = parse()

        /* Fill root */
        root.argument2 = tempNode
        /* Copy root */
        tempNode = root
        /* Create empty root */
        root = createEmptyTree()

        /* Add child node */
        root.argument1 = tempNode
    }

    root.argument2 = { content: END }

    /* Debug print */
    if (debug) {
        logTree(root)
    }

    return root
}

function createEmptyTree(): SyntaxTree {
    return { 
        content: SEQUENCE, 
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

    let action: Token

    let identifier: Token = getToken(currentIndex + 1)
    let type: Token = getToken(currentIndex + 3)

    let value: SyntaxTree

    /* Assign operator */
    if (getToken(currentIndex + 4).lexeme == PUNCTUATION['EQUALS']) {
        action = DECLARE_ASSIGN
        value = { content: getToken(currentIndex + 5) }
        skipAhead = 6
        //TODO: check if constant is of correct type
    } else {
        action = DECLARE
        value = null
        skipAhead = 4
    }

    currentIndex += skipAhead

    return {
        content: action,
        argument1: { 
            content: VARIABLE,
            argument1: { content: identifier },
            argument2: { content: type }
        },
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

    let type: Token = getType(result)
    if (type == null) {
        throw `${result.lexeme} not declared.`
    }

    currentIndex += 5

    return {
        content: ASSIGN,
        argument1: {
            content: VARIABLE,
            argument1: { content: result },
            argument2: { content: type }
        },
        argument2: {
            content: operation,
            argument1: { content: address1 },
            argument2: { content: address2 }
        }
    }

}

function getType(target: Token, tree: SyntaxTree = root): Token {
    let result: Token = null
    if (tree.argument1 != null) {
        if (tree.argument1.content.lexeme == target.lexeme) {
            return tree.argument2.content
        }
        result = getType(target, tree.argument1)
    } 
    if (result == null && tree.argument2 != null) {
        result = getType(target, tree.argument2)
    }
    return result
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
