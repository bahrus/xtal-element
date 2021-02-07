import {define} from '../lib/define.js';
import {destructPropInfo, PropDef, ReactiveSurface, PropAction} from '../types.d.js';
import {getSlicedPropDefs} from '../lib/getSlicedPropDefs.js';
import {letThereBeProps} from '../lib/letThereBeProps.js';
import {propUp} from '../lib/propUp.js';
import {attr} from '../lib/attr.js';
import {RxSuppl} from '../lib/RxSuppl.js';

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

export class NonVisual extends HTMLElement implements NonVisualProps, ReactiveSurface{
    static is = 'non-visual';
    myStringProp: string | undefined;
    connectedCallback(){
        const defaultValues: NonVisualProps = {};
        attr.mergeStr<NonVisualProps>(this, slicedPropDefs.strNames, defaultValues);
        propUp(this, slicedPropDefs.propNames, defaultValues);
    }
    onPropChange(name: string, prop: PropDef){
        console.log(prop);
        this.reactor.addToQueue(prop);
    }

    //ReactiveSurface implementation
    self = this;
    propActions = [({myStringProp, self}: NonVisual) => {
        console.log('I am here', self, myStringProp);
    }] as PropAction[]
    reactor = new RxSuppl(this);

}
letThereBeProps(NonVisual, slicedPropDefs.propDefs, 'onPropChange');

define(NonVisual);