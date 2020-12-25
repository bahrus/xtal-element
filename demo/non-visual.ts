import {define} from '../lib/define.js';
import {destructPropInfo, PropDef} from '../types.d.js';
import {getPropDefs} from '../lib/getPropDefs.js';
import {letThereBeProps} from '../lib/letThereBeProps.js';
import {propUp} from '../lib/propUp.js';
import {attr} from '../lib/attr.js';

const propers : destructPropInfo[] = [
    ({myStringProp}: NonVisual) => ({
        type: String,
        reflect: true
    })
];
const propDefs = getPropDefs(propers);
const propNames = propDefs.map(propDef => propDef.name!);
const stringNames = propDefs.filter(propDef => propDef.type === String).map(propDef => propDef.name!);
export class NonVisual extends HTMLElement{
    static is = 'non-visual';
    myStringProp: string | undefined;
    connectedCallback(){
        const defaultValues: any = {};
        attr.mergeStr(this, stringNames, defaultValues);
        propUp(this, propNames, defaultValues);
    }
    onPropChange(name: string, prop: PropDef){
        console.log(prop);
    }

}
letThereBeProps(NonVisual, propDefs, 'onPropChange');

define(NonVisual);