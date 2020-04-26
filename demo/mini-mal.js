import { createTemplate } from 'trans-render/createTemplate.js';
import { interpolate } from 'trans-render/interpolate.js';
import { XtalElement } from '../xtal-element.js';
const main = Symbol();
const name = 'name';
export class MiniMal extends XtalElement {
    constructor() {
        super(...arguments);
        this.#updateTransform = {
            button: ({ target }) => interpolate(target, 'textContent', this, false),
        };
    }
    //  required in any implementing class
    get readyToInit() { return true; }
    //required in any implementing class
    get mainTemplate() {
        return createTemplate(/* html */ `
        <style>
        .btn {
            font-size: 200%;
        }
        </style>
        <button class="btn">Hello |.name ?? World|</slot></button>
    `, MiniMal, main);
    }
    ;
    //required in any implementing class
    get initTransform() {
        return {
            button: [{}, { click: this.clickHandler }]
        };
    }
    ;
    #updateTransform;
    get updateTransform() {
        return this.#updateTransform;
    }
    clickHandler(e) {
        this.name = 'me';
    }
    //boilerplate code
    #name;
    get name() {
        return this.#name;
    }
    set name(nv) {
        this.attr(name, nv);
    }
    connectedCallback() {
        this.propUp([name]);
        super.connectedCallback();
    }
    static get observedAttributes() {
        return super.observedAttributes.concat([name]);
    }
    attributeChangedCallback(n, ov, nv) {
        switch (n) {
            case name:
                this.#name = nv;
                break;
        }
        this.onPropsChange();
    }
}
customElements.define('mini-mal', MiniMal);
