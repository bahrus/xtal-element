import { XtalElement } from '../xtal-element.js';
import { createTemplate } from '../utils.js';
import { init } from 'trans-render/init.js';
import { update } from 'trans-render/update.js';
import { addEventListeners } from 'event-switch/event-switch.js';
const template = createTemplate(/* html */ `<div>
</div>
<slot name="test"></slot>
<style>
    div{
        cursor:pointer;
    }
</style>
`);
export class Minimal extends XtalElement {
    constructor() {
        super(...arguments);
        this._eventSwitchContext = {
            eventManager: addEventListeners,
            eventRules: {
                click: e => this.onPropsChange(),
                slotchange: e => {
                    console.log('in slot change');
                }
            },
        };
        this._renderContext = {
            init: init,
            transform: {
                div: () => this.viewModel
            }
        };
    }
    get eventSwitchContext() {
        return this._eventSwitchContext;
    }
    get renderContext() {
        return this._renderContext;
    }
    async init() {
        return new Promise(resolve => {
            resolve('👽 Greetings, Earthling. 👽');
        });
    }
    async update() {
        this.renderContext.update = update;
        return new Promise(resolve => {
            resolve('That tickles.');
        });
    }
    get mainTemplate() {
        return template;
    }
    get ready() { return true; }
}
customElements.define('mini-mal', Minimal);
