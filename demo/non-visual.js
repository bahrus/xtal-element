import { define } from '../lib/define.js';
import { getPropDefs } from '../lib/getPropDefs.js';
import { letThereBeProps } from '../lib/letThereBeProps.js';
import { propUp } from '../lib/propUp.js';
import { attr } from '../lib/attr.js';
const propers = [
    ({ myStringProp }) => ({
        type: String,
        reflect: true
    })
];
const propDefs = getPropDefs(propers);
const propNames = propDefs.map(propDef => propDef.name);
const stringNames = propDefs.filter(propDef => propDef.type === String).map(propDef => propDef.name);
export class NonVisual extends HTMLElement {
    connectedCallback() {
        const defaultValues = {};
        attr.mergeStr(this, stringNames, defaultValues);
        propUp(this, propNames, defaultValues);
    }
    onPropChange(name, prop) {
        console.log(prop);
    }
}
NonVisual.is = 'non-visual';
letThereBeProps(NonVisual, propDefs, 'onPropChange');
define(NonVisual);
