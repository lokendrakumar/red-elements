import {
  readPage,
  ctx,
  RED,
  controllers
} from '../imports'

const {
  TypedInput
} = controllers

const clazz = TypedInput

const {
  log
} = console

beforeAll(() => {
  // TypeInput has factory function.
  log('before all...');
  TypedInput(RED)
  // load document with placeholder elements to create widgets (for testing)
  document.documentElement.innerHTML = readPage('simple')
})

let widgetElem

beforeEach(() => {
  log('before each...')
  widgetElem = new TypedInput({
    container: $('#stack')
  })
})

test('TypedInput: is a class', () => {
  expect(typeof clazz).toBe('function')
})

test('TypedInput: widget can be created', () => {
  let elem = $('#typed-input')
  log({
    elem
  })
  let widgetElem = elem.typedInput()
  // log({
  //   widgetElem
  // })
  expect(widgetElem).toBeDefined()
})

test('TypedInput: widget can be resize', () => {
  let elem = $('#typed-input')
  let resize = elem.typedInput('types', ['msg',
    'flow',
    'global',
    'str',
    'num',
    'bool',
    'json',
    're',
    'date',
    'jsonata',
    'bin']);
  expect(resize).toBeDefined()
})
test('TypedInput: option can be clicked', () => {
  let elem = $('.typeOpt')

  let click = elem.click();

  expect(typeof click).toBe('object')
})
test('TypedInput: desired width', () => {
  let elem = $('#typed-input')
  let desired_width = elem.typedInput('width', 200);

  //let click = elem.click();
  expect(desired_width).toBeDefined();

})
test('TypedInput: value to be defined', () => {
  let elem = $('#typed-input')
  let value = elem.typedInput('value', ['msg',
    'flow',
    'global',
    'str',
    'num',
    'bool',
    'json',
    're',
    'date',
    'jsonata',
    'bin']);

  //let click = elem.click();
  expect(value).toBeDefined();

})

test('TypedInput: btnSelectTrigger can be clicked', () => {
  let elem = $('.btnSelectTrigger')

  let btnclick = elem.click();

  expect(typeof btnclick).toBe('object')
})
test('TypedInput: btnSelectTrigger on focus', () => {
  let elem = $('.btnSelectTrigger')

  let btnclick = elem.focus();
  //ReactTestUtils.Simulate.keyDown(elem, {key: "down", keyCode: 40, which: 40});

  //expect(typeof btnclick).toBe('object')
})
test('TypedInput: red-ui-typedInput can be focused', () => {
  let elem = $('.red-ui-typedInput')

  let focus_class = elem.focus();

  expect(typeof focus_class).toBe('object')
})
test('TypedInput: red-ui-typedInput can be blured', () => {
  let elem = $('.red-ui-typedInput')

  let blur_class = elem.blur();

  expect(typeof blur_class).toBe('object')
})