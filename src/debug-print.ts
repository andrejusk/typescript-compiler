
import { Type, TypeS } from './types'
import colors = require('colors/safe')

/** Debug Token print function */ 
export function logToken(Token: Token): void {
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

/** Debug print function */ 
export function logProcedure(procedure: Procedure): void {
    if (procedure == null) {
        return
    }

    console.log(
        colors.yellow(`  >>\t`) +
        colors.cyan(`${procedure.action}\t`) +
        colors.cyan(`${procedure.argument1}\t & `) +
        colors.cyan(`${procedure.argument2}\t-> `) +
        colors.cyan(`${procedure.result}`)
    )
}

/** Debug print function */ 
export function logTree(node: SyntaxTree, indent: number = 0): void {
    /* Indent by the given amount */
    let index: number = 0
    let prefix: string = ""
    while (index < indent) {
        prefix += `\t`
        index++
    }
    prefix += colors.yellow(`>> `)

    /* Don't print null nodes */
    if (node == null) {
        //console.log(prefix + colors.grey("null"))
        return
    }

    /* Infix traversal */
    logTree(node.argument1, indent + 1)
    console.log(
        prefix + colors.cyan(`${node.content.name}\t`)
    )
    logTree(node.argument2, indent + 1)
}



export function logInfo(message: string) {
    console.log(colors.blue('[INFO] ') + message)
}

export function logError(message: string) {
    console.log(colors.red(message))
}
