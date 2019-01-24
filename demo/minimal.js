import { XtalElement } from '../xtal-element.js';
import { createTemplate } from '../utils.js';
import { init } from 'trans-render/init.js';
import { update } from 'trans-render/update.js';
import { addEventListeners } from 'event-switch/event-switch.js';
const template = createTemplate(/* html */ `<div></div>`);
export class Minimal extends XtalElement {
    constructor() {
        super(...arguments);
        this._eventSwitchContext = {
            addEventListeners: addEventListeners,
            eventSwitch: {
                click: e => this.onPropsChange(),
            }
        };
        this._renderContext = {
            init: init,
            transform: {
                div: x => this.viewModel
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
            resolve('Greetings, Earthling.');
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
//# sourceMappingURL=minimal.js.map