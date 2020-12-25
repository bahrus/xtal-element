import {define} from '../lib/define.js';
import {destructPropInfo, PropDef} from '../types.d.js';
import {getSlicedPropDefs} from '../lib/getSlicedPropDefs.js';
import {letThereBeProps} from '../lib/letThereBeProps.js';
import {propUp} from '../lib/propUp.js';
import {attr} from '../lib/attr.js';

const propDefGetter : destructPropInfo[] = [
    ({myStringProp}: NonVisualProps) => ({
        type: String,
        reflect: true
    })
];
const slicedPropDefs = getSlicedPropDefs(propDefGetter);

export interface NonVisualProps{
    myStringProp?: string | undefined;
}

export class NonVisual extends HTMLElement implements NonVisualProps{
    static is = 'non-visual';
    myStringProp: string | undefined;
    connectedCallback(){
        const defaultValues: NonVisualProps = {};
        attr.mergeStr<NonVisualProps>(this, slicedPropDefs.strNames, defaultValues);
        propUp(this, slicedPropDefs.propNames, defaultValues);
    }
    onPropChange(name: string, prop: PropDef){
        console.log(prop);
    }

}
letThereBeProps(NonVisual, slicedPropDefs.propDefs, 'onPropChange');

define(NonVisual);