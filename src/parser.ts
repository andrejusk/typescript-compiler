
import { logToken, logProcedure } from './debug-print'
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

    let procedure: Procedure
    let tac: Procedure[] = new Array()

    while (true) {
        /* Parse token */
        let procedure = parse()
        tac.push(procedure)
        if (debugFlag) {
            logProcedure(procedure)
        }
        /* End of tokens */
        if (currentIndex >= tokens.length) {
            break;
        }
    }

    return tac
}





function parse(): Procedure {

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
function parseDeclaration(): Procedure {
    let skipAhead: number

    //TODO: sanity check punctuation

    let identifier: Token = getToken(currentIndex + 1)
    let type: Token = getToken(currentIndex + 3)
    let value: string

    /* Assign operator */
    if (getToken(currentIndex + 4).lexeme == PUNCTUATION['EQUALS']) {
        value = getToken(currentIndex + 5).lexeme
        skipAhead = 6
    } else {
        value = null
        skipAhead = 4
    }

    currentIndex += skipAhead

    return {
        action: 'DECLARE',
        argument1: type.name,
        argument2: value,
        result: identifier.name
    }
}

/** 
 * 0      12  345
 * console.log(a)
 */
function parsePrint(): Procedure {
    //TODO: sanity check (punctuation)
    let identifier: Token = getToken(currentIndex + 4)
    currentIndex += 6
    return {
        action: 'PRINT',
        argument1: identifier.name,
        argument2: null,
        result: null
    }
}


/** 
 * 0 1 2 3 4
 * a = b + c
*/
function parseExpression(): Procedure {

    let action: string

    let result: Token = getToken(currentIndex)
    let address1: Token = getToken(currentIndex + 2)
    let operation: Token = getToken(currentIndex + 3)
    let address2: Token = getToken(currentIndex + 4)

    switch (operation.name) {
        case 'PLUS':
            action = 'ADD'
            break
        case 'MINUS':
            action = 'SUBTRACT'
            break
        default:
            action = undefined
    }

    currentIndex += 5

    return {
        action: action,
        argument1: address1.name,
        argument2: address2.name,
        result: result.name
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
