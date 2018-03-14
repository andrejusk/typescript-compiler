
import { logTree } from './debug-print'
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

    let valueToken: Token
    let value: SyntaxTree

    /* Assign operator */
    if (getToken(currentIndex + 4).lexeme == PUNCTUATION['EQUALS']) {
        if (getToken(currentIndex + 6).lexeme == PUNCTUATION['DOT']) {
            throw `Number type must be an integer.`
        }
        action = DECLARE_ASSIGN
        valueToken = getToken(currentIndex + 5)
        if (type.name.toString().toLowerCase() != valueToken.name.toString().toLowerCase()) {
            throw `${valueToken.name} cannot be assigned to ${type.name}`
        }        
        value = createConstant(valueToken)
        skipAhead = 6
    } else if (getToken(currentIndex + 4).type == Type.CONSTANT) {
        throw `Expected '=' at ${getLocation(getToken(currentIndex + 1))}`
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
    let value: SyntaxTree    

    if (identifier.name == 'string') {
        value = createConstant(identifier)
    } else {
        value = {
            content: VARIABLE,
            argument1: { content: identifier },
            argument2: { content: getType(identifier) }
        }
    }
    currentIndex += 6
    return {
        content: action,
        argument1: value
    }

}


/** 
 * 0 1 2 3 4
 * a = b + c
 * 
 * 0 1 2
 * a = b
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

    let operation: Token = getToken(currentIndex + 1)

    /* Check type of operation */
    if (operation.lexeme != "=") {
        if (operation.lexeme == "++" || operation.lexeme == "--") {
            if (type.name != "NUMBER") {
                throw `${result.lexeme} is not of number type.` 
            }
            if (operation.lexeme == "++") {
                operation = {
                    type: Type.PUNCTUATION,
                    name: "PLUS",
                    lexeme: "+",
                    location: operation.location
                }
            } else {
                operation = {
                    type: Type.PUNCTUATION,
                    name: "MINUS",
                    lexeme: "-",
                    location: operation.location
                }
            }            
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
                        argument1: { content: result },
                        argument2: { content: type }
                    },
                    argument2: createConstant({
                        type: Type.CONSTANT,
                        name: "number",
                        lexeme: "1",
                        location: null
                    })
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

        /* Assign */
        if (operation.type != Type.PUNCTUATION) {
            adjust = 3

            let argument2: SyntaxTree

            /* Constant */
            if (address1.type == Type.CONSTANT) {
                argument2 = createConstant(address1)
            /* Identifier */
            } else {
                argument2 = { 
                    content: VARIABLE,
                    argument1: { content: address1 },
                    argument2: { content: type1 }
                }
            }
            expression = {
                content: ASSIGN,
                argument1: {
                    content: VARIABLE,
                    argument1: { content: result },
                    argument2: { content: type }
                },
                argument2: argument2
            }
        } else {
            let address2: Token = getToken(currentIndex + 4)
            let type2: Token = getType(address2, root)

            if (type.name != "NUMBER") {
                throw `${result.lexeme} is not of number type.` 
            }

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
    }

    currentIndex += adjust
    return expression
}

function getType(target: Token, tree: SyntaxTree = root): Token {
    let result: Token = null
    /* Constant */
    if (target.type == Type.CONSTANT) {
        return { 
            type: Type.TYPE, 
            name: target.name, 
            lexeme: target.name, 
            location: null 
        }
    }
    /* Variable */
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
