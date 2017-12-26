import {
  format
} from '../../..'

const {
  common
} = format

test('common: structure', () => {
  t.is(typeof common, 'object')
  t.is(typeof common.handle, 'function')
})

// handle(content, segments, args, locale)
test('common: handle', () => {
  let content = 'xyz'
  t.truthy(common.handle(content))
})