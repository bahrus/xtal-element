import { XtalViewElement } from '../xtal-view-element.js';
import { createTemplate } from 'trans-render/createTemplate.js';
const template = createTemplate(
/* html */ `<div></div>`);
export class MinimalView extends XtalViewElement {
    constructor() {
        super(...arguments);
        this.#count = 0;
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
    init() {
        return new Promise(resolve => {
            resolve('Greetings, Earthling.');
        });
    }
    update() {
        return new Promise(resolve => {
            resolve('That tickles number ' + this.count);
        });
    }
    get mainTemplate() {
        return template;
    }
    get readyToInit() { return true; }
}
customElements.define('mini-mal-view', MinimalView);
