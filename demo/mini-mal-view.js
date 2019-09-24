import { XtalViewElement } from '../xtal-view-element.js';
import { createTemplate, newRenderContext } from '../utils.js';
import { update } from 'trans-render/update.js';
import { newEventContext } from 'event-switch/event-switch.js';
const template = createTemplate(
/* html */ `<div></div>`);
export class MinimalView extends XtalViewElement {
    constructor() {
        super(...arguments);
        this._eventContext = newEventContext({
            click: e => this.onPropsChange()
        });
    }
    get eventContext() {
        return this._eventContext;
    }
    get initRenderContext() {
        return this._initRC === undefined ? newRenderContext({
            div: x => this.viewModel
        }) : this._initRC; //TODO: optional chaining
    }
    async init() {
        return new Promise(resolve => {
            resolve('Greetings, Earthling.');
        });
    }
    async update() {
        this.initRenderContext.update = update;
        return new Promise(resolve => {
            resolve('That tickles.');
        });
    }
    get mainTemplate() {
        return template;
    }
    get readyToInit() { return true; }
}
customElements.define('mini-mal-view', MinimalView);
