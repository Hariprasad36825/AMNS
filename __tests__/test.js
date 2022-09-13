const sampleFunc = require('../sample')

describe('sample tests', () => {
  test('print hello world', () => {
    const result = sampleFunc()
    expect(result).toBe('hello world')
  })
})
