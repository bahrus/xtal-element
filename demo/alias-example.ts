import {PropDefMap, xc, PropDef, ReactiveSurface, PropAction, IReactor} from '../lib/XtalCore.js';

const linkProp2 = ({prop1, self}: AliasExample) =>{
    console.log('in linkProp2');
    (<any>self)[slicedPropDefs.propLookup.prop2!.alias!] = 'hello';
    console.log(self.prop2);
}
const propActions = [linkProp2] as PropAction[];

export class AliasExample extends HTMLElement implements ReactiveSurface{
    static is = 'alias-example';

    prop1: string | undefined;
    prop2: string | undefined;
    

    self = this;
    propActions = propActions;
    reactor: IReactor = new xc.Rx(this);

    connectedCallback(){
        xc.mergeProps(this, slicedPropDefs);
    }

    onPropChange(n: string, propDef: PropDef, newVal: any){
        this.reactor.addToQueue(propDef, newVal);
    }
}

const str: PropDef = {
    type: String,
    async: true,
}
const propDefMap: PropDefMap<AliasExample> = {
    prop1: str,
    prop2: {
        type: String,
        async: true,
        dry: true,
        obfuscate: true,
    }
};

const slicedPropDefs = xc.getSlicedPropDefs(propDefMap);
xc.letThereBeProps(AliasExample, slicedPropDefs, 'onPropChange');
xc.define(AliasExample);