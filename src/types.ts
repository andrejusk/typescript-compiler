
/** Lexim types */
export enum Type {
    'WHITESPACE',
    'PUNCTUATION',
    'IDENTIFIER',
    'CONSTANT',
    'RESERVED'
}

/** Abbereviated lexeme types */
export enum TypeS {
    'WHITE',
    'PUNCT',
    'IDENT',
    'CONST',
    'RESER'
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
    'DOUBLE_QUOTE': '.',
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
    'LET':                  'let',
    'NUMBER':               'number',
    'CONSOLE':              'console',
    'LOG':                  'log'
}
