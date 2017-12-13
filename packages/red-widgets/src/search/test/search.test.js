import {
  readPage,
  ctx as baseCtx,
  RED,
  Search,
  Searchbox
} from './imports'

function create(ctx) {
  return new Search(ctx)
}

let events = {
  on() { },
  emit(id) { }
}
let actions = {
  add() { }
}
let view = {
  reveal(id) { }
}
let utils = {
  getNodeLabel(n) {
    if (n.label === 'abc') {
      return 'my-label'
    }
    else if (n.label === '') {
      return null;
    }
  }
}
let nodes = {
  eachWorkspace() { },
  eachSubflow() { },
  eachConfig() { },
  eachNode() { }
}
let keyboard = {
  add(char, escape, func) { },
  remove(escape) { }
}

const ctx = Object.assign({
  events,
  actions,
  utils,
  nodes,
  view,
  keyboard
}, baseCtx)

let search
beforeEach(() => {
  search = create(ctx)
})

beforeAll(() => {
  Searchbox(RED)
  // EditableList(RED)
  document.documentElement.innerHTML = readPage('search', __dirname);
})

test('Search: created', () => {
  expect(search).toBeDefined()
})

test('Search: disabled', () => {
  expect(search.disabled).toBeFalsy()
})

test('Search: disable()', () => {
  search.disable()
  expect(search.disabled).toBeTruthy()
})

test('Search: enable()', () => {
  search.disable()
  search.enable()
  expect(search.disabled).toBeFalsy()
})


test('Search: indexNode', () => {
  let n = {
    id: 'x',
    label: 'abc'
  }
  search.indexNode(n)
  // fix
  let indexed = search.index[n.label]
  expect(indexed).toEqual({
    "x": {
      "label": "my-label",
      "node": {
        "id": "x",
        "label": "abc"
      }
    }
  })
})

test('Search: indexWorkspace()', () => {
  search.indexWorkspace()
  expect(search.index).toEqual({})
})
test('Search: search(val) - no searchResults, throws', () => {
  const val = 'hello'
  expect(() => search.search(val)).toThrowError()
})

// test.only('Search: search(val) - w searchResults works', () => {
//   const val = 'hello'
//   // to ensure searchResults initialized
//   search.createDialog()
//   let results = search.search(val).results
//   expect(results).toEqual([])
// })

test('Search: ensureSelectedIsVisible', () => {
  search.searchResults = $('#searchResult1');
  search.ensureSelectedIsVisible();
  expect(typeof search.ensureSelectedIsVisible).toBe('function');
})

// test('Search: createDialog', () => {
//   search.searchResults = $('#searchResult1');
//   search.createDialog();
//   console.log("SEACH",search.searchInput.change);
//   expect(typeof search.createDialog).toBe('function');
// })

test('Search: reveal', () => {
  search.reveal({ id: 102 });
})
test('Search: can hide when dialog is null', () => {
  search.dialog = null;
  search.hide();
})
test('Search: can show when dialog is defined', () => {
  search.dialog = {
    slideDown(int) { }
  }
  search.show();
})
test('Search: can show with disabled true', () => {
  search.disabled = true;
  search.show();
})
test('Search: can show when visible true', () => {
  search.visible = true;
  search.show();
})

test('Search: can hide when visible true', () => {
  search.visible = true;
  search.dialog = {
    slideUp(int) { }
  }
  search.hide();
})

// test('Search: events.on null', () => {
//   try {
//     ctx.actions = { add() { } };
//     ctx.events = { on: null };
//   }
//   catch (e) {
//   }
// })
// test('Search: action.add null', () => {
//   try {
//     ctx.actions = { add: null };
//     ctx.events = { on() { } };
//     search = create(ctx)
//   }
//   catch (e) {
//   }
// })
// test('Search: actions null', () => {
//   try {
//     ctx.actions = null;
//     search = create(ctx)
//   }
//   catch (e) {
//   }
// })


// test('Search: indexNode with null utils', () => {
//   let n = {
//     id: 'x',
//     label: 'abc'
//   }
//   search.ctx.utils = null;
//   try {
//     search.indexNode(n)
//   }
//   catch (e) { }
// })
// test('Search: indexWorkspace with null nodes', () => {
//   search.ctx.nodes = null;
//   try {
//     search.indexWorkspace()
//   }
//   catch (e) { }
// })


// test('Search: reveal', () => {})
// test('Search: show', () => {})
// test('Search: hide', () => {})

// test('Search: created with out action', () => {
//   try {
//     ctx.actions = null;
//     expect(search).toBeDefined()
//   }
//   catch (e) { }
// })