
import { logToken, logTree } from './debug-print'
import { RESERVED, PUNCTUATION } from './types';

let debugFlag: boolean

let tokens: Token[]
let currentIndex: number = 0

/**
 * Parses tokens.
 * @param lex Tokens to parse.
 * @param debug Print debug messages.
 */
export function parseTokens(lex: Token[], debug: boolean) {
    debugFlag = debug

    tokens = lex

    let node: SyntaxTree
    let root: SyntaxTree

    while (true) {
        /* Parse token */
        node = parse()
        if (debugFlag) {
            logTree(node)
        }
        /* End of tokens */
        if (currentIndex >= tokens.length) {
            break;
        }
    }

    return root
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
    
    logToken(getCurrentToken())
    currentIndex++
    return null
}

/** 
 * 0   1 2 3       4 5
 * let a : number (= 10)
 */
function parseDeclaration(): SyntaxTree {
    let skipAhead: number

    //TODO: sanity check punctuation

    let identifier: Token = getToken(currentIndex + 1)
    let type: Token = getToken(currentIndex + 3)
    let value: SyntaxTree

    /* Assign operator */
    if (getToken(currentIndex + 4).lexeme == PUNCTUATION['EQUALS']) {
        value = { content: getToken(currentIndex + 5) }
        skipAhead = 6
    } else {
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
 */
function parsePrint(): SyntaxTree {
    //TODO: sanity check (punctuation)
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

function getNextIndex(): number {
    return currentIndex + 1
}

function getCurrentIndex(): number {
    return currentIndex
}



function getToken(index: number): Token {
    return tokens[index]
}

function getNextToken(): Token {
    return getToken(getNextIndex())
}

function getCurrentToken(): Token {
    return getToken(getCurrentIndex())
}
