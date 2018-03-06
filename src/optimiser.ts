import { logTree } from './debug-print'
import { Type } from './types'

let root: SyntaxTree
let updated: boolean

export function optimise(tree: SyntaxTree, debug: boolean = false): SyntaxTree {
    root = tree
    do {
        updated = false
        runOptimiser(root)
    } while(updated)

    if (debug) {
        logTree(root)
    }

    return root
}

function runOptimiser(node: SyntaxTree) {

    if (node == null) {
        return
    }

    /* Optimise tree */
    if (node.argument1 != null && node.argument1.content.type == Type['SEQUENCE']) {
        if (node.argument1.argument2 == null) {
            updated = true
            node.argument1 = node.argument1.argument1
        }
        else if (node.argument1.argument1 == null) {
            updated = true
            node.argument1 = node.argument1.argument2
        }
    } 
    
    /* Optimise tree */
    if (node.argument2 != null && node.argument2.content.type == Type['SEQUENCE']) {
        if (node.argument2.argument2 == null) {
            updated = true
            node.argument2 = node.argument2.argument1
        }
        else if (node.argument2.argument1 == null) {
            updated = true
            node.argument2 = node.argument2.argument2
        }
    }


    if (node.content.type == Type['DECLARE'] && isUnused(node, root)) {
        remove(node, root)
    }

    if (node.content.type == Type['ASSIGN']) {
        if (isUnique(node, root)) {
            replace(node.argument1, node.argument2, root)
        }
        if (isUnused(node, root)) {
            remove(node, root)
        }
    }

    if (node.content.type == Type['DECLARE_ASSIGN']) {
        if (isUnique(node, root)) {
            replace(node.argument1, node.argument2, root)
        }
        if (isUnused(node, root)) {
            remove(node, root)
        }
    }

    checkConstantOperations(node)
    
    runOptimiser(node.argument1)
    runOptimiser(node.argument2)

}

function isUnused(test: SyntaxTree, node: SyntaxTree): boolean {

    if (node == null) {
        return true
    }

    /* Ignore self */
    if (node == test) {
        return true
    }

    /* Ignore declarations */
    if (node.content.type == Type['ASSIGN']) {
        return true
    }

    /* If using variable */
    if (node.content.lexeme == test.argument1.argument1.content.lexeme) {
        return false
    }

    return isUnused(test, node.argument1) && isUnused(test, node.argument2)

}

function isUnique(test: SyntaxTree, node: SyntaxTree): boolean {

    if (node == null) {
        return true
    }

    /* If reassigning the same variable */
    if (node.content.type == Type['ASSIGN'] && node.argument1.argument1.content.lexeme == test.argument1.argument1.content.lexeme) {
        /* If reference node, ignore */
        if (node != test) {
            /* Not unique */
            return false            
        }
    }

    return isUnique(test, node.argument1) && isUnique(test, node.argument2)

}

function replace(variable: SyntaxTree, constant: SyntaxTree, node: SyntaxTree) {

    if (node == null) {
        return
    }

    if (node.content.type == Type['DECLARE'] || node.content.type == Type['DECLARE_ASSIGN']|| node.content.type == Type['ASSIGN']) {
        /* Don't touch so they can be later removed */
    }

    else if (node.argument1 != null && node.argument1.content.type == Type['VARIABLE']) {
        if (node.argument1.argument1.content.lexeme == variable.argument1.content.lexeme) {
            updated = true
            node.argument1 = {
                content: constant.content,
                argument1: constant.argument1,
                argument2: constant.argument2
            }
        }
    }

    else if (node.argument2 != null && node.argument2.content.type == Type['VARIABLE']) {
        if (node.argument2.argument1.content.lexeme == variable.argument1.content.lexeme) {
            updated = true
            node.argument2 = {
                content: constant.content,
                argument1: constant.argument1,
                argument2: constant.argument2
            }
        }
    }

    replace(variable, constant, node.argument1)
    replace(variable, constant, node.argument2)

}

function remove(tree: SyntaxTree, node: SyntaxTree) {

    if (node == null) {
        return
    }

    if (node.argument1 == tree) {
        updated = true
        node.argument1 = null
    }

    if (node.argument2 == tree) {
        updated = true
        node.argument2 = null
    }

    remove(tree, node.argument1)
    remove(tree, node.argument2)

}

function checkConstantOperations(node: SyntaxTree) {

    if (node == null) {
        return
    }

    /* Maths */
    if (node.argument1 != null && node.argument1.content.type == Type['PUNCTUATION']) {
        /* On two constants */
        if (node.argument1.argument1.content.type == Type['CONSTANT'] && node.argument1.argument2.content.type == Type['CONSTANT']) {
            /* Number */
            if (node.argument1.argument1.argument2.content.lexeme == 'number') {
                let result: number, value1: number, value2: number

                value1 = Number(node.argument1.argument1.argument1.content.lexeme)
                value2 = Number(node.argument1.argument2.argument1.content.lexeme)
                
                if (node.argument1.content.name == 'PLUS') {
                    result = value1 + value2
                } else if (node.argument1.content.name == 'MINUS') {
                    result = value1 - value2
                } else if (node.argument1.content.name == 'ASTERISK') {
                    result = value1 * value2
                } else {
                    throw 'what hte heck'
                }

                updated = true

                node.argument1 = {
                    content: node.argument1.argument1.content,
                    argument1: {
                        content: {
                            type: Type['IDENTIFIER'],
                            name: result,
                            lexeme: result,
                            location: null                            
                        }
                    },
                    argument2: {
                        content: node.argument1.argument1.argument2.content
                    }
                }
            /* String perhaps */
            } else {

            }                
        }
    }

    if (node.argument2 != null && node.argument2.content.type == Type['PUNCTUATION']) {
        /* On two constants */
        if (node.argument2.argument1.content.type == Type['CONSTANT'] && node.argument2.argument2.content.type == Type['CONSTANT']) {
            /* Number */
            if (node.argument2.argument1.argument2.content.lexeme == 'number') {
                let result: number, value1: number, value2: number

                value1 = Number(node.argument2.argument1.argument1.content.lexeme)
                value2 = Number(node.argument2.argument2.argument1.content.lexeme)
                
                if (node.argument2.content.name == 'PLUS') {
                    result = value1 + value2
                } else if (node.argument2.content.name == 'MINUS') {
                    result = value1 - value2
                } else if (node.argument2.content.name == 'ASTERISK') {
                    result = value1 * value2
                } else {
                    throw 'what hte heck part 2 electric boogaloo'
                }

                updated = true

                node.argument2 = {
                    content: node.argument2.argument1.content,
                    argument1: {
                        content: {
                            type: Type['IDENTIFIER'],
                            name: result,
                            lexeme: result,
                            location: null                            
                        }
                    },
                    argument2: {
                        content: node.argument2.argument1.argument2.content
                    }
                }
            /* String perhaps */
            } else {

            }                
        }
    }


}