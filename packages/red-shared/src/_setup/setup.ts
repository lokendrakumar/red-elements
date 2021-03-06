import { Container, injectable, tagged, named } from 'inversify';
import 'reflect-metadata';
let container = new Container();
export let TYPES = { RED: 'IRED' };
export interface IRED {
  i18n: any;
  comms: any;
  user: any;
  deploy: any;
  diff: any;
  notifications: any;
  search: any;
  library: any;
  settings: any;
  actions: any;
  palette: any,
  stack: any,
  text: any;
  events: any;
  view: any;
  utils: any;
  popover: any;
  nodes: any;
  sidebar: any;
  _: any;
  tray: any;
  tabs: any;
  history: any;
  editor: any;
  userSettings: any;
  workspaces: any;
  subflow: any;
  state: any;
  typeSearch: any;
  touch: any;
  keyboard: any;
  menu: any;
  notify(func, node?, withTimeout?, timeout?);
  clipboard: any
}

@injectable()
export class RED implements IRED {
  public palette: any
  public stack: any
  public comms: any
  public user: any
  public deploy: any
  public diff: any
  public notifications: any
  public search: any
  public library = {
    loadFlowLibrary() { }
  }

  public i18n = {
    loadCatalog() { }
  }

  public settings = {
    theme(id) { },
    get(id) { return id },
    set(settings, state) { },
    remove(id) { }
  };
  public actions = {
    get(callback) { },
    add(selector, elem) { }
  }
  public events = {
    on(elem, fun) { },
    emit(elm) { }
  }
  public view = {
    focus() { },
    selection() {
      return [{
        id: 'x'
      }]  // nodes selected
    }
  }
  public text = {
    bidi: {
      // for renameTab
      resolveBaseTextDir(label) {
        return label;
      }
    }
  }
  public utils = {
    getNodeIcon(def) { },
    eachWorkspace(indexNode) { },
    getNodeLabel(l) { return l; },
    validatePropertyExpression() { return true; }
  }
  public popover = {
    create(obj) {
      return {
        open() { },
        close() { }
      }
    }
  }
  public nodes = {
    subflow(index) { },
    addLink(link) { },
    removeLink(link) { },
    filterNodes(filter) {
      return [{
        id: 'x'
      }] // set of filtered nodes
    },
    workspace(id) {
      return {
        id: 'my-workspace'
      }
    },
    createExportableNodeSet(nodes) {
      return {
        id: 'x'
      }
    }
  }
  public sidebar = {
    info: {
      set(text) { }
    }
  }
  public _ = function () { }
  public tray = {
    close() { },
    show() { }
  }
  public tabs = {
    create(obj) { }
  }
  public history = {
    push(event) { }
  }
  public editor = {
    validateNode(node) { }
  }
  public userSettings = {
    toggle(elem) { }
  }
  public workspaces = {
    active() {
      return {} // the currently active workspace
    }
  }
  public subflow = {
    refresh(val) { }
  }
  public state = {
    QUICK_JOINING: true,
    JOINING: true,
    DEFAULT: true,
    MOVING_ACTIVE: true,
    MOVING: true,
    IMPORT_DRAGGING: true
  }
  public typeSearch = {
    show(obj) { }
  }
  public touch = {
    radialMenu: {
      active: () => { }
    }
  }
  public keyboard = {
    getShortcut(action) {
      return 'x'
    },
    remove(selector) { },
    add(selector) { }
  }
  /**
   *  setDisabled
   */
  public menu = {
    setDisabled() { }
  }
  notify(func, node?, a?, b?) { }
  public clipboard = {
    copyText(key, copyPath, msgPath) { }
  }
}
container.bind<IRED>(TYPES.RED).to(RED);
export { container };

