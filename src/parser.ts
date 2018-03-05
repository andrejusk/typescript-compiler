
import { logToken, logTree } from './debug-print'
import { Type, RESERVED, PUNCTUATION } from './types'

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

const CONSTANT: Token = { 
    type: Type.CONSTANT, 
    name: 'CONSTANT', 
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
export function parseTokens(lex: Token[], debug: boolean = false) {
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
        throw `Expected ':' at ${getLocation(getToken(currentIndex + 1))}`
    }

    let skipAhead: number

    let action: Token

    let identifier: Token = getToken(currentIndex + 1)
    let type: Token = getToken(currentIndex + 3)

    let value: SyntaxTree

    /* Assign operator */
    if (getToken(currentIndex + 4).lexeme == PUNCTUATION['EQUALS']) {
        action = DECLARE_ASSIGN
        value = createConstant(getToken(currentIndex + 5))
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
        throw `Expected '.' at ${getLocation(getToken(currentIndex))}`
    }
    /* Sanity check log function */
    if (getToken(currentIndex + 2).lexeme != "log") {
        throw `Expected 'log' at ${getLocation(getToken(currentIndex + 1))}`
    }
    /* Sanity check parenthesis */
    if (getToken(currentIndex + 3).lexeme != "(") {
        throw `Expected '(' at ${getLocation(getToken(currentIndex + 2))}`
    }
    /* Sanity check parenthesis */
    if (getToken(currentIndex + 5).lexeme != ")") {
        throw `Expected ')' at ${getLocation(getToken(currentIndex + 4))}`
    }

    let action: Token = getToken(currentIndex + 2)
    let identifier: Token = getToken(currentIndex + 4)
    currentIndex += 6
    return {
        content: action,
        argument1: createConstant(identifier)
    }

}


/** 
 * 0 1 2 3 4
 * a = b + c
 * 
 * 01
 * a++
 * a--
*/
function parseExpression(): SyntaxTree {
    let expression: SyntaxTree
    let adjust: number = 0

    let result: Token = getToken(currentIndex)
    let type: Token = getType(result)

    if (type == null) {
        throw `${result.lexeme} not declared at ${getLocation(result)}.`
    }

    if (type.name != "NUMBER") {
        throw `${result.lexeme} is not of number type.` 
    }

    let operation: Token = getToken(currentIndex + 1)

    /* Check type of operation */
    if (operation.lexeme != "=") {
        if (operation.lexeme == "++" || operation.lexeme == "--") {
            expression = {
                content: operation,
                argument1: {
                    content: result
                },
                argument2: {
                    content: type
                }
            }
            adjust = 2
        } else {
            throw `Expected operator at ${getLocation(operation)}.`
        }
    } else {
        let address1: Token = getToken(currentIndex + 2)
        let type1: Token = getType(address1, root)
    
        let operation: Token = getToken(currentIndex + 3)
    
        let address2: Token = getToken(currentIndex + 4)
        let type2: Token = getType(address2, root)

        if (type1.name != type2.name) {
            throw `${address1.lexeme} and ${address2.lexeme} are not of same type at ${getLocation(operation)}.`
        }
    
        adjust = 5
    
        expression = {
            content: ASSIGN,
            argument1: {
                content: VARIABLE,
                argument1: { content: result },
                argument2: { content: type }
            },
            argument2: {
                content: operation,
                argument1: { 
                    content: VARIABLE,
                    argument1: { content: address1 },
                    argument2: { content: type1 }
                },
                argument2: { 
                    content: VARIABLE,
                    argument1: { content: address2 },
                    argument2: { content: type2 }
                }
            }
        }
    }

    currentIndex += adjust
    return expression
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

function getLocation(token: Token): string {
    return `${token.location.v + 1}:${token.location.h + 1}`
}



function createConstant(token: Token): SyntaxTree {
    let type: Token
    if (token.type != Type.CONSTANT) {
        type = getType(token)
    } else {
        type = { 
            type: Type.TYPE, 
            name: token.name, 
            lexeme: token.name, 
            location: null 
        }  
    }
    return {
        content: CONSTANT,
        argument1: { 
            content: { 
                type: Type.IDENTIFIER,
                name: token.lexeme, 
                lexeme: token.lexeme, 
                location: null 
            } 
        },
        argument2: { content: type }
    }
}


function getToken(index: number): Token {
    return tokens[index]
}

function getCurrentToken(): Token {
    return getToken(currentIndex)
}
