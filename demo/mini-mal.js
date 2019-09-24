import { createTemplate } from '../utils.js';
import { XtalElement } from '../xtal-element.js';
const template = createTemplate(
/* html */ `
    <!-- scoped styles -->
    <style>
    .btn {
		  font-size: 200%;
	  }
    </style>
    <!-- html -->
    <button class="btn">Hello <slot>World</slot></button>`);
export class MiniMal extends XtalElement {
    get readyToInit() { return true; }
    get mainTemplate() { return template; }
}
customElements.define('mini-mal', MiniMal);
