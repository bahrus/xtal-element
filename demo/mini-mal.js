var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
};
var _updateTransform, _name;
import { createTemplate } from 'trans-render/createTemplate.js';
import { interpolate } from 'trans-render/interpolate.js';
import { XtalElement } from '../xtal-element.js';
const main = Symbol();
const name = 'name';
export class MiniMal extends XtalElement {
    constructor() {
        super(...arguments);
        _updateTransform.set(this, {
            button: ({ target }) => interpolate(target, 'textContent', this, false),
        });
        //#region boilerplate code
        _name.set(this, void 0);
        //#endregion
    }
    //#region Required Members
    get readyToInit() { return true; }
    get readyToRender() { return true; }
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
    get initTransform() {
        return {
            button: [{}, { click: this.clickHandler }]
        };
    }
    ;
    get updateTransform() {
        return __classPrivateFieldGet(this, _updateTransform);
    }
    //#endregion
    clickHandler(e) {
        this.name = 'me';
    }
    get name() {
        return __classPrivateFieldGet(this, _name);
    }
    set name(nv) {
        this.attr(name, nv);
    }
    connectedCallback() {
        this.pr([name]);
        super.connectedCallback();
    }
    static get observedAttributes() {
        return super.observedAttributes.concat([name]);
    }
    attributeChangedCallback(name, oldVal, newVal) {
        switch (name) {
            case name:
                __classPrivateFieldSet(this, _name, newVal);
                break;
        }
        this.onPropsChange();
    }
}
_updateTransform = new WeakMap(), _name = new WeakMap();
customElements.define('mini-mal', MiniMal);
