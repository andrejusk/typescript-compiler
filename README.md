# TypeScript Compiler

This `README.md` contains high-level detail 
about the coursework and language 
from the submitted report. 

See individual `.md`s for detail on the:
* [Lexical Analyser ](./docs/lexical-analyser.md)
* [Parser           ](./docs/parser.md)
* [Code Generator   ](./docs/code-generator.md)
* [Code Optimiser   ](./docs/optimiser.md)

## Introduction

The scope of this coursework is to implement a compiler for a source language that
has no run-time errors but may issue run-time warnings. 

### Source Language
The source language for the compiler is chosen to be a subset of TypeScript. TypeScript
is an open-source programming language, which is a strict syntactical superset of JavaScript
and adds static typing to the language [1], as opposed to JavaScript’s no static type nature [2].
Due to the open-source nature of it, access to its language specification is public. Along with
this, since the language is widely used, running [3] and comparing original code during tests
[4] will be made easier. The subset chosen is described in the Description of Source Language
section.

### Target Language
The target language chosen is C. This was mainly chosen due to the low-level nature
of the language, allowing for complex algorithms to be executed at close to machine clock.
Also, development is made easier due to existing familiarity with the language from previously
assessed coursework, most notably CS1PR16 C/C++ labs and CS1FC16 sorting coursework in
C.

### Implementation Language
The language chosen for the compiler is also TypeScript. This was done to build more
familiarity with the programming language, with a view of using it for future projects (most
notably, the upcoming final year project). Also, with the rather simple nature of the chosen
subset of the language, and the performance of the development machines, some efficiency
is traded for greater flexibility of the compiler.

## Description of Source Language

### Description
For the compiler to be implemented and tested, the source language is defined. Since
TypeScript has a very large grammar, a subset of it is chosen and defined.

The main feature required in the subset is output. TypeScript allows standard output
to the command-line using its `console.log(content)` function. As a result, both console
and log are added as reserved keywords for the compiler to detect output to stdout. In this
case, content can be either a constant or a variable, as seen in Figure 1 and Figure 2
respectively.

```ts
    console.log("Hello, world!")
```
*Figure 1. Standard Output with Constant Example*
```ts
    let num: number = 3
    console.log(num)
```
*Figure 2. Standard Output with Identifier Example*

Along with this, the let keyword is added to the reserved list, for use in variable
declarations. TypeScript allows multiple types of variables to be declared, and the main ones
chosen in the subset are string and number types. Although in Typescript the number types
are stored as floating-point values [5], they will be restricted to integers for this application.
Along with this, a constant may be added to the declaration to assign a value to the newly
declared variable.

Examples of valid declaration statements are shown in Figure 3.
```ts
    let num: number
    let str: string
```
*Figure 3. Declare Statements*

Examples of valid declare and assign statements are shown in Figure 4.
```ts
    let num: number = 3
    let str: string = "Hello, world!"
```
*Figure 4. Declare and Assign Statements*

Assignment may be performed outside of the declaration, as seen in Figure 5.
```ts
    let str: string
    str = "Hello, world!"
```
*Figure 5. Assign Statements with Constants*

Previous assignment statements use constants as the value. Valid assignment
statements also allow identifiers to be used, as seen in Figure 6.
```ts
    let str: string
    let hello: string = "Hello, world!"
    str = hello
```
*Figure 6. Assign Statements with Identifiers*

Arithmetic may be performed in assignment statements as well on number typed
variables, as seen in Figure 7.
```ts
    let a: number = 1
    let b: number = 2
    let c: number
    c = a + b
```
*Figure 7. Assign Statements with Arithmetic*

Along with addition, other available arithmetic operations in the subset are:
subtraction, multiplication, incrementation, decrementation. 