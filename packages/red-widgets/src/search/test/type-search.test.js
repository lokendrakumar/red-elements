import {
  readPage,
  ctx,
  RED,
  TypeSearch,
  Searchbox,
  EditableList
} from './imports'


function create(ctx) {
  return new TypeSearch(ctx)
}

let ts
beforeEach(() => {
  ts = new TypeSearch(ctx)
})

beforeAll(() => {
  Searchbox(RED)
  EditableList(RED)

  document.documentElement.innerHTML = readPage('simple')
})

test('TypeSearch: create', () => {
  expect(ts.disabled).toBeFalsy()
})

test('TypeSearch: search', () => {
  let val = 'x'
  ts.search(val)
  // updates UI with search result

  // use nightmare
})

test('TypeSearch: ensureSelectedIsVisible', () => {
  ts.ensureSelectedIsVisible()
  // use nightmare
})

test.only('TypeSearch: createDialog', () => {
  ts.createDialog()
  // use nightmare
})

test('TypeSearch: confirm', () => {
  let def = {}
  ts.confirm(def)
  // use nightmare
})

test('TypeSearch: handleMouseActivity', () => {
  let def = {}
  let evt = (ev) => {
    console.log({
      ev
    })
  }
  ts.handleMouseActivity(evt)
  // use nightmare
})

test('TypeSearch: show', () => {
  let _ctx = Object.assign({
    keyboard: {
      add() {

      }
    }

  }, ctx)
  ts = create(_ctx)
  let opts = {}
  ts.show(opts)
  // use nightmare
})

test('TypeSearch: hide', () => {
  let opts = {}
  let fast = 'x'
  ts.hide(fast)
  // use nightmare
})

test('TypeSearch: getTypeLabel', () => {
  let opts = {}
  let type = 'x'
  let def = {}
  ts.getTypeLabel(type, def)
  // use nightmare
})

test('TypeSearch: refreshTypeList', () => {
  ts.refreshTypeList()
  // use nightmare
})
