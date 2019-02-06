import { XtalViewElement } from '../xtal-view-element.js';
import { createTemplate, newRenderContext } from '../utils.js';
import { update } from 'trans-render/update.js';
import { newEventContext } from 'event-switch/event-switch.js';
const template = createTemplate(/* html */ `<div></div>`);
export class MinimalView extends XtalViewElement {
    constructor() {
        super(...arguments);
        this._eventContext = newEventContext({
            click: e => this.onPropsChange()
        });
        this._renderContext = newRenderContext({
            div: x => this.viewModel
        });
    }
    get eventContext() {
        return this._eventContext;
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
customElements.define('mini-mal-view', MinimalView);
