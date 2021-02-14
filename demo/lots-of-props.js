import { xc } from '../lib/XtalCore.js';
const linkProp5 = ({ prop1, prop2, prop3, prop4, self }) => {
    console.log('in linkProp5');
    self.prop5 = '' + prop1 + prop2 + prop3 + prop4;
};
const propActions = [linkProp5];
export class LotsOfProps extends HTMLElement {
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
LotsOfProps.is = 'lots-of-props';
const str = {
    type: String,
    async: true,
};
const propDefMap = {
    prop1: str, prop2: str, prop3: str, prop4: str, prop5: str,
};
const slicedPropDefs = xc.getSlicedPropDefs(propDefMap);
xc.letThereBeProps(LotsOfProps, slicedPropDefs.propDefs, 'onPropChange');
xc.define(LotsOfProps);
