import { Type } from './types'
import { logTree, logToken } from './debug-print'

export function compile(tree: SyntaxTree): String {
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
        //TODO TYPES
        return `int ${tree.argument1.argument1.content.lexeme};\n`
    }

    else if (tree.content.name == "ASSIGN") {
        //TODO TYPES
        return `${tree.argument1.argument1.content.lexeme} = ${compile(tree.argument2)};\n`
    }

    else if (tree.content.name == "DECLARE_ASSIGN") {
        //TODO TYPES
        return `int ${tree.argument1.argument1.content.lexeme} = ${compile(tree.argument2)};\n`
    }

    else if (tree.content.type == Type.CONSTANT) {
        return tree.content.lexeme
    }

    else if (tree.content.name == "PLUS") {
        return `${compile(tree.argument1)}+${compile(tree.argument2)}`
    }

    else if (tree.content.type == Type.IDENTIFIER) {
        return `${tree.content.lexeme}`
    }

    else if (tree.content.name == "LOG") {
        //TODO: types
        return `printf("%d", ${tree.argument1.content.lexeme});\n`
    }

    else {
        code = ""
    }

    return `${compile(tree.argument1)}${code}${compile(tree.argument2)}`
}

