const nightmare = require('../nightmare')
import test from 'ava'
import {
  Actions
} from './ui'

const ctx = {}
const evt = 'hello'

function create(ctx) {
  return new Actions(ctx)
}

function func(event) {
  return ':'
}

test('Actions: create', () => {
  let actions = create(ctx)
  t.is(typeof actions, 'object')
})

test('Actions: addAction', () => {
  let actions = create(ctx)
  actions.addAction('a', func)
  t.is(actions.actions['a'], func)
})

test('Actions: removeAction', () => {
  let actions = create(ctx)
  actions.addAction('a', func)
  actions.removeAction('a')
  t.is(actions.length, 0)
})

test('Actions: getAction', () => {
  let actions = create(ctx)
  actions.addAction('a', func)
  let action = actions.getAction('a')
  t.is(action, func)
})

test('Actions: invokeAction', () => {
  let actions = create(ctx)
  actions.addAction('a', func)
  let result = actions.invokeAction('a')
  t.is(result, ':')
})

test('Actions: listActions', () => {
  let actions = create(ctx)
  actions.addAction('a', func)
  let list = actions.listActions()
  let item = list[0]
  t.is(item.id, 'a')
})
