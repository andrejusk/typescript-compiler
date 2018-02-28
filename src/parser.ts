
import { log } from './debug-print'

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
