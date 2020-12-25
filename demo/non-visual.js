import { define } from '../lib/define.js';
import { getPropDefs } from '../lib/getPropDefs.js';
import { propDef } from '../lib/propDef.js';
const propers = [
    ({ myStringProp }) => ({
        type: String,
        reflect: true
    })
];
const propDefs = getPropDefs(propers);
export class NonVisual extends HTMLElement {
    onPropChange(prop) {
        console.log(prop);
    }
}
NonVisual.is = 'non-visual';
propDef(NonVisual, propDefs, 'onPropChange');
define(NonVisual);
