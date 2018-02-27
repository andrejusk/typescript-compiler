
import { Type, TypeS, WHITESPACE, PUNCTUATION, RESERVED } from './types'

declare global {

    /** Form of Three Address Code (TAC) */
    class Procedure {
        action: string
        argument1: string
        argument2: string
        result: string
    }
}

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

    let tac: Procedure[] = new Array()

    while (true) {
        /* Parse token */
        tac.push(parse())
        /* End of tokens */
        if (currentIndex >= tokens.length) {
            break;
        }
    }

    return tac
}





function parse(): Procedure {
    log(getCurrentToken())
    currentIndex++
    return null
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




import colors = require('colors/safe')

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
        colors.yellow(`${Token.location.v}`) +
        `:` +
        colors.yellow(`${Token.location.h}`)
    )
}