import {createTemplate, newRenderContext} from '../utils.js';
import {update} from 'trans-render/update.js';
import {interpolate} from 'trans-render/interpolate.js';
import {newEventContext} from 'event-switch/event-switch.js';
import {XtalElement} from '../xtal-element.js';
const template = createTemplate(
    /* html */`
    <!-- scoped styles -->
    <style>
    .btn {
		  font-size: 200%;
	  }
    </style>
    <!-- html -->
    <button class="btn">Hello <slot>World</slot></button>`
);
export class MiniMal extends XtalElement{
    get readyToInit(){return true;}
    get mainTemplate(){return template;}
}
customElements.define('mini-mal', MiniMal);