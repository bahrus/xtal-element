import {define} from '../lib/define.js';
import {destructPropInfo, PropDef} from '../types.d.js';
import {getPropDefs} from '../lib/getPropDefs.js';
import {propDef} from '../lib/propDef.js';

const propers : destructPropInfo[] = [
    ({myStringProp}: NonVisual) => ({
        type: String,
        reflect: true
    })
];
const propDefs = getPropDefs(propers);
export class NonVisual extends HTMLElement{
    static is = 'non-visual';
    myStringProp: string | undefined;
    onPropChange(prop: PropDef){
        console.log(prop);
    }
}
propDef(NonVisual, propDefs, 'onPropChange');

define(NonVisual);