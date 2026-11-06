const assert = require('assert')
const { PassThrough } = require('stream')
const blessed = require('blessed')
const contrib = require('../')

const screen = blessed.screen({
  input: new PassThrough(),
  output: new PassThrough(),
  terminal: 'xterm'
})
const grid = new contrib.grid({ rows: 12, cols: 12, screen })

try {
  for (const [name, options] of [
    ['proto', '{"label":"safe","__proto__":{"polluted":"yes"}}'],
    ['constructor', '{"label":"safe","constructor":{"prototype":{"polluted":"yes"}}}'],
    ['nested', '{"style":{"__proto__":{"polluted":"yes"}}}']
  ]) {
    assert.strictEqual(({}).polluted, undefined)
    grid.set(0, 0, 4, 4, contrib.line, JSON.parse(options))
    assert.strictEqual(({}).polluted, undefined, name)
  }
  grid.set(4, 4, 4, 4, contrib.line, {
    label: 'normal',
    style: { line: 'yellow' }
  })
  console.log('Prototype pollution regression tests passed')
} finally {
  if (typeof screen.destroy === 'function') screen.destroy()
}
