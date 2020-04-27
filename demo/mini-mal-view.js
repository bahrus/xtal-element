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
var _count;
import { XtalViewElement } from '../xtal-view-element.js';
import { createTemplate } from 'trans-render/createTemplate.js';
const template = createTemplate(
/* html */ `<div></div>`);
export class MinimalView extends XtalViewElement {
    constructor() {
        super(...arguments);
        _count.set(this, 0);
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
    get count() {
        return __classPrivateFieldGet(this, _count);
    }
    set count(nv) {
        __classPrivateFieldSet(this, _count, nv);
        this.onPropsChange();
    }
    inc() {
        this.count++;
    }
}
_count = new WeakMap();
customElements.define('mini-mal-view', MinimalView);
