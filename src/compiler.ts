import { Type } from './types'
import { logTree, logToken } from './debug-print'

export function compile(tree: SyntaxTree): string {
    //logTree(root)
    let code: string

    if (tree == null || tree == undefined) {
        return ""
    }

    else if (tree.content.name == "START") {
        return `#include <stdio.h>\nint main() {\n`
    }

    else if (tree.content.name == "END") {
        return `return 0;\n}`
    }

    else if (tree.content.name == "DECLARE") {
        return `int ${tree.argument1.argument1.content.lexeme};\n`
    }

    else if (tree.content.name == "ASSIGN") {
        return `${tree.argument1.argument1.content.lexeme} = ${compile(tree.argument2)};\n`
    }

    else if (tree.content.name == "DECLARE_ASSIGN") {
        return `int ${tree.argument1.argument1.content.lexeme} = ${compile(tree.argument2.argument1)};\n`
    }

    else if (tree.content.type == Type.CONSTANT) {
        if (tree.argument2.content.name == "string") {
            return `"${tree.argument1.content.lexeme}"`
        } else {
            return tree.argument1.content.lexeme
        }
    }

    else if (tree.content.name == "INCREMENT") {
        return `(${compile(tree.argument1)}++);\n`
    }

    else if (tree.content.name == "DECREMENT") {
        return `(${compile(tree.argument1)}--);\n`
    }

    else if (tree.content.name == "PLUS") {
        return `(${compile(tree.argument1)} + ${compile(tree.argument2)})`
    }

    else if (tree.content.name == "MINUS") {
        return `(${compile(tree.argument1)} - ${compile(tree.argument2)})`
    }

    else if (tree.content.name == "ASTERISK") {
        return `(${compile(tree.argument1)} * ${compile(tree.argument2)})`
    }

    else if (tree.content.type == Type.IDENTIFIER) {
        return `${tree.content.lexeme}`
    }

    else if (tree.content.name == "LOG") {
        let type: string = ""
        if (tree.argument1.argument2.content.lexeme == "string") {
            type = "%s"
        } else if (tree.argument1.argument2.content.lexeme == "number") {
            type = "%d"
        } else {
            type = "%s"
        }
        return `printf("${type}", ${compile(tree.argument1)});\n`
    }

    else {
        code = ""
    }

    return `${compile(tree.argument1)}${code}${compile(tree.argument2)}`
}

