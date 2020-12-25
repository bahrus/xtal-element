import { define } from '../lib/define.js';
import { getPropDefs } from '../lib/getPropDefs.js';
import { letThereBeProps } from '../lib/letThereBeProps.js';
const propers = [
    ({ myStringProp }) => ({
        type: String,
        reflect: true
    })
];
const propDefs = getPropDefs(propers);
export class NonVisual extends HTMLElement {
    onPropChange(name, prop) {
        console.log(prop);
    }
}
NonVisual.is = 'non-visual';
letThereBeProps(NonVisual, propDefs, 'onPropChange');
define(NonVisual);
