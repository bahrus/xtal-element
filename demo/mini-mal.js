import { createTemplate } from 'trans-render/createTemplate.js';
import { interpolate } from 'trans-render/interpolate.js';
import { XtalElement, define } from '../XtalElement.js';
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
    }
}
MiniMal.is = 'mini-mal';
MiniMal.attributeProps = ({ disabled, name }) => ({
    boolean: [disabled],
    string: [name],
});
define(MiniMal);
