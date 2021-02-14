import {PropDefMap, xc, PropDef, ReactiveSurface, PropAction} from '../lib/XtalCore.js';

const linkProp5 = ({prop1, prop2, prop3, prop4, self}: LotsOfProps) =>{
    console.log('in linkProp5');
    self.prop5 = '' + prop1 + prop2 + prop3 + prop4;
}
const propActions = [linkProp5] as PropAction[];

export class LotsOfProps extends HTMLElement implements ReactiveSurface{
    static is = 'lots-of-props';

    prop1: string | undefined;
    prop2: string | undefined;
    prop3: string | undefined;
    prop4: string | undefined;
    prop5: string | undefined;

    self = this;
    propActions = propActions;
    reactor = new xc.Rx(this);

    connectedCallback(){
        xc.hydrate(this, slicedPropDefs);
    }

    onPropChange(n: string, propDef: PropDef, newVal: any){
        this.reactor.addToQueue(propDef, newVal);
    }
}

const str: PropDef = {
    type: String,
    async: true,
}
const propDefMap: PropDefMap<LotsOfProps> = {
    prop1: str, prop2: str, prop3: str, prop4: str, prop5: str,
};

const slicedPropDefs = xc.getSlicedPropDefs(propDefMap);
xc.letThereBeProps(LotsOfProps, slicedPropDefs.propDefs, 'onPropChange');
xc.define(LotsOfProps);