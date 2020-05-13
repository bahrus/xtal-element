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
var _name;
import { createTemplate } from 'trans-render/createTemplate.js';
import { interpolate } from 'trans-render/interpolate.js';
import { XtalElement } from '../XtalElement.js';
const main = Symbol();
const name = 'name';
const buttonSym = Symbol();
export class MiniMal extends XtalElement {
    constructor() {
        super(...arguments);
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
            button: [, { click: () => { this.name = 'me'; } }, , , buttonSym],
        };
        this.updateTransforms = [
            ({ name }) => ({
                [buttonSym]: ({ target }) => interpolate(target, 'textContent', this, false),
            })
        ];
        _name.set(this, void 0);
    }
    get name() {
        return __classPrivateFieldGet(this, _name);
    }
    set name(nv) {
        __classPrivateFieldSet(this, _name, nv);
        this.onPropsChange('name');
    }
}
_name = new WeakMap();
MiniMal.attributeProps = ({ disabled, name }) => ({
    boolean: [disabled],
    string: [name],
});
customElements.define('mini-mal', MiniMal);
