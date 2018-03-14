
import { Type, TypeS } from './types'
import colors = require('colors/safe')

/** Debug Token print function */ 
export function logToken(Token: Token): void {
    let nameColor: colors = getColour(Token)

    console.log(
        colors.blue(`  >>`) +
        colors.grey(`\t[`) +
        nameColor(`${TypeS[Token.type]}`) +
        colors.grey(`] `) +
        nameColor(`${(Token.name.length > 7) ? (Token.name.substr(0, 7)) : Token.name}\t`) +
        colors.grey(`at `) +
        colors.yellow(`${Token.location.v}`) +
        `:` +
        colors.yellow(`${Token.location.h}`)
    )
}

/** Debug print function */ 
export function logTree(node: SyntaxTree, indent: number = 0, side: string = ">"): void {
    /* Indent by the given amount */
    let index: number = 0
    let prefix: string = ""
    while (index < indent) {
        prefix += `\t`
        index++
    }
    prefix += colors.yellow(`${side}> `)

    /* Don't print null nodes */
    if (node == null) {
        return
    }

    let nameColor: colors = getColour(node.content)

    let printName: boolean = (Type[node.content.type] != node.content.name)
    let printLex: boolean = (node.content.lexeme != null) 
        && (node.content.lexeme.toString().toLowerCase() != node.content.name.toString().toLowerCase())

    /* Infix traversal */
    logTree(node.argument1, indent + 1, '/')
    if (node.content != null) {
        console.log(
            prefix + (`[${nameColor(Type[node.content.type])}]`) + 
            (printName ? (` - ${colors.cyan(node.content.name)}`) : "") +
            (printLex ? (`, ${colors.grey(node.content.lexeme)}\t`) : "")
        )
    } else {
        console.log(
            prefix + (colors.yellow(`[NULL]\t`))
        )
    }
    logTree(node.argument2, indent + 1, '\\')
}



export function logOutput(message: string) {
    console.log(colors.green('[OUTPUT] ') + message)
}

export function logInfo(message: string) {
    console.log(colors.blue('[INFO] ') + message)
}

export function logError(message: string) {
    console.log(colors.red(message))
}

export function logCode(code: string) {
    console.log(colors.yellow('[OUTPUT] ') + 'Compiled code:')
    console.log('\t' + code.split('\n').join('\n\t'))
}

function getColour(Token: Token): colors {
    switch (Token.type) {
        case Type.VARIABLE:
        case Type.CONSTANT:
            return colors.green

        case Type.IDENTIFIER:
            return colors.cyan

        case Type.PUNCTUATION:
            return colors.white

        case Type.TYPE:
        case Type.RESERVED:
            return colors.blue

        case Type.START:
        case Type.END:
        case Type.DECLARE:
        case Type.DECLARE_ASSIGN:
        case Type.ASSIGN:
            return colors.magenta

        case Type.WHITESPACE:

        default:
            return colors.grey
    }
}