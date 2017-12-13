/**
 * Copyright JS Foundation and other contributors, http://js.foundation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/

// jquery-ui and webpack, how to manage it into module?
// https://stackoverflow.com/questions/33998262/jquery-ui-and-webpack-how-to-manage-it-into-module

// Full GUIDE
// http://code.tonytuan.org/2017/03/webpack-import-jquery-ui-in-es6-syntax.html

// jQuery
import {
  jQuery
} from './jquery-ui'

const {
  log
} = console

export default factory

function factory(RED) {
  (function ($) {
    $.widget("nodered.checkboxSet", {
      _create: function () {
        this.uiElement = this.element.wrap("<span>").parent();
        this.uiElement.addClass("red-ui-checkboxSet");
        if (this.options.parent) {
          this.parent = this.options.parent;
          this.parent.checkboxSet('addChild', this.element);
        }
        this.children = [];
        this.partialFlag = false;
        this.stateValue = 0;
        var initialState = this.element.prop('checked');
        this.options = [
          $('<span class="red-ui-checkboxSet-option hide"><i class="fa fa-square-o"></i></span>').appendTo(this.uiElement),
          $('<span class="red-ui-checkboxSet-option hide"><i class="fa fa-check-square-o"></i></span>').appendTo(this.uiElement),
          $('<span class="red-ui-checkboxSet-option hide"><i class="fa fa-minus-square-o"></i></span>').appendTo(this.uiElement)
        ];
        if (initialState) {
          this.options[1].show();
        } else {
          this.options[0].show();
        }

        this.element.change(() => {
          if (this.checked) {
            this.options[0].hide();
            this.options[1].show();
            this.options[2].hide();
          } else {
            this.options[1].hide();
            this.options[0].show();
            this.options[2].hide();
          }
          var isChecked = this.checked;
          this.children.forEach(function (child) {
            child.checkboxSet('state', isChecked, false, true);
          })
        })
        this.uiElement.click((e) => {
          e.stopPropagation();
          // state returns null for a partial state. Clicking on that should
          // result in false.
          this.state((this.state() === false) ? true : false);
        })
        if (this.parent) {
          this.parent.checkboxSet('updateChild', this);
        }
      },
      _destroy: function () {
        if (this.parent) {
          this.parent.checkboxSet('removeChild', this.element);
        }
      },
      addChild: function (child) {
        this.children.push(child);
      },
      removeChild: function (child) {
        var index = this.children.indexOf(child);
        if (index > -1) {
          this.children.splice(index, 1);
        }
      },
      updateChild: function (child) {
        var checkedCount = 0;
        this.children.forEach(function (c, i) {
          if (c.checkboxSet('state') === true) {
            checkedCount++;
          }
        });
        if (checkedCount === 0) {

          this.state(false, true);
        } else if (checkedCount === this.children.length) {
          this.state(true, true);
        } else {
          this.state(null, true);
        }
      },
      disable: function () {
        this.uiElement.addClass('disabled');
      },
      state: function (state, suppressEvent, suppressParentUpdate) {

        if (arguments.length === 0) {
          return this.partialFlag ? null : this.element.is(":checked");
        } else {
          this.partialFlag = (state === null);
          var trueState = this.partialFlag || state;
          this.element.prop('checked', trueState);
          if (state === true) {
            this.options[0].hide();
            this.options[1].show();
            this.options[2].hide();
          } else if (state === false) {
            this.options[2].hide();
            this.options[1].hide();
            this.options[0].show();
          } else if (state === null) {
            this.options[0].hide();
            this.options[1].hide();
            this.options[2].show();
          }
          if (!suppressEvent) {
            this.element.trigger('change', null);
          }
          if (!suppressParentUpdate && this.parent) {
            this.parent.checkboxSet('updateChild', this);
          }
        }
      }
    })

  })(jQuery);
}
