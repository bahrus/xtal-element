import { createTemplate } from 'trans-render/createTemplate.js';
import { interpolate } from 'trans-render/interpolate.js';
import { XtalElement } from '../XtalElement.js';
const main = Symbol();
const name = 'name';
export class MiniMal extends XtalElement {
    constructor() {
        super(...arguments);
        //#region XtalElement Members
        //#region required
        this.readyToInit = true;
        this.readyToRender = true;
        this.mainTemplate = createTemplate(/* html */ `
        <style>
        .btn {
            font-size: 200%;
        }
        </style>
        <button class="btn">Hello |.name ?? World|</slot></button>
        <div></div>
    `, MiniMal, main);
        this.initTransform = {
            button: [{}, { click: () => { this.name = 'me'; } }]
        };
        //#endregion
        //#region implemented members
        this.updateTransforms = [
            ({ name }) => ({
                button: ({ target }) => interpolate(target, 'textContent', this, false),
            })
        ];
        //#endregion
    }
    //#endregion
    //#endregion
    //#region boilerplate code
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
    attributeChangedCallback(name, oldVal, newVal) {
        switch (name) {
            case name:
                this.#name = newVal;
                break;
        }
        this.onPropsChange(name);
    }
}
customElements.define('mini-mal', MiniMal);
