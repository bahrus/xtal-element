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
const mainTemplate = createTemplate(/* html */ `
<style>
.btn {
    font-size: 200%;
}
</style>
<button class="btn">Hello |.name ?? World|</slot></button>
<div></div>
`);
const buttonSym = Symbol();
export class MiniMal extends XtalElement {
    constructor() {
        super(...arguments);
        //This property / field allows the developer to wait for some required 
        //properties to be set before doing anything.
        this.readyToInit = true;
        //Until readyToRender is set to true, the user will see the light children (if using Shadow DOM).
        //You can return true/false.  You can also indicate the name of an alternate template to clone (mainTemplate is the default property for the main template)
        this.readyToRender = true;
        //XtalElement is intended for visual elements only.
        //Templates need to be stored outside instances of web components for 
        //optimal performance
        this.mainTemplate = mainTemplate;
        //uses trans-render syntax: https://github.com/bahrus/trans-render
        //initTransform is only done once.
        this.initTransform = {
            button: [, { click: () => { this.name = 'me'; } }, , , buttonSym],
        };
        // updateTransforms is called anytime property "name" changes.
        // Any other property changes won't trigger an update, as there is no
        // arrow function in array with any other property name.
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
