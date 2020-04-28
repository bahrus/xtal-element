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
        //#region Required Members
        this.readyToInit = true;
        this.readyToRender = true;
        this.mainTemplate = template;
        this.initTransform = {
            div: [{}, { click: this.clickHandler }],
        };
        this.updateTransform = () => ({
            div: this.viewModel,
        });
        _count.set(this, 0);
    }
    init() {
        return new Promise(resolve => {
            resolve('Greetings, Earthling.');
        });
    }
    update() {
        return new Promise(resolve => {
            resolve('That tickles, number ' + this.count);
        });
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
