
declare global {
    /** Holds vertical and horizontal character values */
    class SourcePos {
        h: number
        v: number
    }

    /** Token class, value and lexeme optional */
    class Token {
        type: Type
        name: string
        lexeme: string
        location: SourcePos
    }

    /** Symbol to name mapping */
    interface SymbolMap {
        [name: string]: string
    }

    /** Stores program syntax in a binary tree format */
    class SyntaxTree {
        content: Token
        argument1?: SyntaxTree
        argument2?: SyntaxTree 
    }
}

/** Lexim types */
export enum Type {
    /* Token types */
    'WHITESPACE',
    'PUNCTUATION',
    'IDENTIFIER',
    'CONSTANT',
    'RESERVED',
    'TYPE',

    /* Program start/end flags */
    'START',
    'END',
    'SEQUENCE',
    'VARIABLE',

    /* Variable operations */
    'DECLARE',
    'ASSIGN',
    'DECLARE_ASSIGN'
}

/** Abbereviated lexeme types */
export enum TypeS {
    'WHITE',
    'PUNCT',
    'IDENT',
    'CONST',
    'RESER',
    'TYPED',
}

/** WHITE - Whitespace */
export const WHITESPACE: SymbolMap = {
    'SPACE':        ' ',
    'RETURN':       '\r',
    'NEWLINE':      '\n',
    'TAB':          '\t',
    'V_TAB':        '\v',
    'BACKSPACE':    '\b',
    'FORM_FEED':    '\f',
    'EOF':          '\0'
}

/** PUNCT - Punctuation */
export const PUNCTUATION: SymbolMap = {
    'COMMA':        ',',
    'COLON':        ':',
    'SEIMCOLON':    ';',
    'DOT':          '.',
    'SINGLE_QUOTE': '\'',
    'DOUBLE_QUOTE': '"',
    'BACKSLASH':    '\\',
    'FWDSLASH':     '/',
    'ASTERISK':     '*',
    'EXCLAMATION':  '!',
    'AMPERSAND':    '&',
    'EQUALS':       '=',
    'PLUS':         '+',
    'MINUS':        '-',  
    'O_PAR':        '(',
    'C_PAR':        ')',
    'O_CUR_BR':     '{',
    'C_CUR_BR':     '}',
    'O_ANG_BR':     '<',
    'C_ANG_BR':     '>',
    'O_SQR_BR':     '[',
    'C_SQR_BR':     ']'
}

/** RESER - Reserved */
export const RESERVED: SymbolMap = {
    'LET':          'let',
    'CONSOLE':      'console',
    'LOG':          'log'
}

export const TYPES: SymbolMap = {
    'NUMBER':       'number',
    'STRING':       'string',
    'BOOLEAN':      'boolean'
}