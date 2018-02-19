import { exec } from 'ts-process-promises'
import { expect } from 'chai'
import 'mocha'

let scriptFolder = '\\scripts\\'

let typescriptTests: { goal, file, result }[] = [
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
            exec('ts-node ' + __dirname + scriptFolder + test.file + '.ts --fast')
            /* Compare result */
            .then(result => {
                expect(result.stdout).to.equal(test.result + '\n')
                done()
            })
        })
    })
})
