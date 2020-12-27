import { define } from '../lib/define.js';
import { getSlicedPropDefs } from '../lib/getSlicedPropDefs.js';
import { letThereBeProps } from '../lib/letThereBeProps.js';
import { propUp } from '../lib/propUp.js';
import { attr } from '../lib/attr.js';
import { Reactor } from '../lib/Reactor.js';
const propDefGetter = [
    ({ myStringProp }) => ({
        type: String,
        reflect: true
    })
];
const slicedPropDefs = getSlicedPropDefs(propDefGetter);
export class NonVisual extends HTMLElement {
    constructor() {
        super(...arguments);
        //ReactiveSurface implementation
        this.self = this;
        this.propActions = [({ myStringProp, self }) => {
                console.log('I am here', self, myStringProp);
            }];
        this.reactor = new Reactor(this);
    }
    connectedCallback() {
        const defaultValues = {};
        attr.mergeStr(this, slicedPropDefs.strNames, defaultValues);
        propUp(this, slicedPropDefs.propNames, defaultValues);
    }
    onPropChange(name, prop) {
        console.log(prop);
        this.reactor.addToQueue(prop);
    }
}
NonVisual.is = 'non-visual';
letThereBeProps(NonVisual, slicedPropDefs.propDefs, 'onPropChange');
define(NonVisual);
