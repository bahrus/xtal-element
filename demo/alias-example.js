import { xc } from '../lib/XtalCore.js';
const linkProp2 = ({ prop1, self }) => {
    console.log('in linkProp2');
    self[slicedPropDefs.propLookup.prop2.alias] = 'hello';
    console.log(self.prop2);
};
const propActions = [linkProp2];
export class AliasExample extends HTMLElement {
    constructor() {
        super(...arguments);
        this.self = this;
        this.propActions = propActions;
        this.reactor = new xc.Rx(this);
    }
    connectedCallback() {
        xc.hydrate(this, slicedPropDefs);
    }
    onPropChange(n, propDef, newVal) {
        this.reactor.addToQueue(propDef, newVal);
    }
}
AliasExample.is = 'alias-example';
const str = {
    type: String,
    async: true,
};
const propDefMap = {
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
