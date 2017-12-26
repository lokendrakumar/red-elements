import {
  format
} from '../../..'

const {
  misc
} = format

test('misc: structure', () => {
  t.is(typeof misc, 'object')
  t.is(typeof misc.isBidiLocale, 'function')
})

// isBidiLocale(locale)
test('misc: isBidiLocale', () => {
  let locale = 'us'
  t.truthy(misc.isBidiLocale(locale))
})