import {
  format
} from '../../..'

const {
  message
} = format

test('message: structure', () => {
  t.is(typeof message, 'object')
  t.is(typeof message.format, 'function')
})

// format(text)
test('message: format', () => {
  let content = 'xyz'
  t.truthy(message.format(content))
})
