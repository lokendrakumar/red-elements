import { Component, Prop, Element } from '@stencil/core'
import { controllers } from '../controllers'
import { createjQueryWidget } from "./util"



@Component({
  tag: 'red-checkbox-set',
  styleUrl: 'red-checkbox-set.scss'
})
export class RedCheckboxSet {
  constructor() {
    // RED should (ideally) be the RED runtime
    const RED = {}
    // registers CheckboxSet as a jQuery widget on $
    controllers.CheckboxSet(RED)

    // now turn this element into a CheckboxSet jQuery widget
    createjQueryWidget(this, this.me, 'red-ui-checkboxSet');
  }

  // See https://medium.com/@gilfink/getting-to-know-stencil-decorators-350c13ce6d38
  @Element() me: HTMLElement;

  @Prop() first: string;

  render() {
    return (
      <div class="red-ui-checkboxSet">
        RedCheckboxSet
      </div>
    );
  }
}