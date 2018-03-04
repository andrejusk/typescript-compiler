
var { exec } = require('child_process')
var chai = require('chai')
var expect = chai.expect
var mocha = require('mocha')

let scriptFolder = '\\scripts\\'

let typescriptTests = [
    { 'goal': 'prints',     'file': 'hello-world',              'result': 'Hello, world!' },
    { 'goal': 'adds',       'file': 'number-addition',          'result': '3' },
    { 'goal': 'subtracts',  'file': 'number-subtraction',       'result': '1' },
    { 'goal': 'increments', 'file': 'number-increment',         'result': '4' },
    { 'goal': 'decrements', 'file': 'number-decrement',         'result': '2' },
    { 'goal': 'multiplies', 'file': 'number-multiplication',    'result': '6' },
]

describe('Typescript scripts', () => {
    typescriptTests.forEach((test) => {
        it(test.goal, (done) => {
            /* Execute typescript */
            exec(`ts-node ${__dirname + scriptFolder + test.file}.ts --fast`, (e, result, stderr) => {
                /* Compare result */
                expect(result).to.be.equal(`${test.result}\n`)
                done()
            })
        })
    })
})
/*
describe('Compiler', () => {
    typescriptTests.forEach((test) => {
        it(test.goal, (done) => {
            //Execute typescript
            exec(`ts-node ${__dirname}\\..\\index.ts ${__dirname + scriptFolder + test.file}.ts --fast`,  (e, result, stderr) => {
                //Compare result
                expect(result).to.be.equal(`${test.result}\n`)
                done()
            })
        })
    })
})
*/