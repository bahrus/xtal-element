import { XtalViewElement } from '../xtal-view-element.js';
import { createTemplate } from 'trans-render/createTemplate.js';
const template = createTemplate(
/* html */ `<div></div>`);
export class MinimalView extends XtalViewElement {
    constructor() {
        super(...arguments);
        this.#count = 0;
    }
    //#region Required Members
    get readyToInit() { return true; }
    init() {
        return new Promise(resolve => {
            resolve('Greetings, Earthling.');
        });
    }
    get readyToRender() { return true; }
    update() {
        return new Promise(resolve => {
            resolve('That tickles, number ' + this.count);
        });
    }
    get mainTemplate() {
        return template;
    }
    get initTransform() {
        return {
            div: [{}, { click: this.clickHandler }],
        };
    }
    get updateTransform() {
        return {
            div: this.viewModel
        };
    }
    //#endregion
    clickHandler(e) {
        this.inc();
    }
    #count;
    get count() {
        return this.#count;
    }
    set count(nv) {
        this.#count = nv;
        this.onPropsChange();
    }
    inc() {
        this.count++;
    }
}
customElements.define('mini-mal-view', MinimalView);
