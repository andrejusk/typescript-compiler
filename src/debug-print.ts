
import { Type, TypeS } from './types'
import colors = require('colors/safe')

/** Debug print function */ 
export function log(Token: Token): void {
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



export function logInfo(message: string) {
    console.log(colors.blue('[INFO] ') + message)
}

export function logError(message: string) {
    console.log(colors.red(message))
}
