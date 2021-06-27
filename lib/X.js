import { xc } from './XtalCore.js';
import { xp } from './XtalPattern.js';
import { DOMKeyPE } from './DOMKeyPE.js';
import { getDestructArgs } from './getDestructArgs.js';
import { getSlicedPropDefs } from './getSlicedPropDefs.js';
export class X extends HTMLElement {
    constructor() {
        super(...arguments);
        this.self = this;
    }
    attributeChangedCallback(n, ov, nv) {
        this.disabled = nv !== null;
    }
    onPropChange(name, prop, nv) {
        if (this.reactor === undefined) {
            this.reactor = new xp.RxSuppl(this, [
                {
                    rhsType: Array,
                    ctor: DOMKeyPE
                }
            ]);
        }
        this.reactor.addToQueue(prop, nv);
    }
    static tend(config) {
        const propActions = [xp.manageMainTemplate, config.propActions || [], config.noShadow ? xp.appendClone : xp.createShadow];
        class newClass extends (config.class || X) {
            constructor() {
                super(...arguments);
                this.propActions = propActions;
                this.mainTemplate = config.mainTemplate;
                this.refs = config.refs || {};
            }
        }
        newClass.is = config.name;
        //const nativeProps = xc.getPropDefs(xp.props);
        let propDefs = config.propDefs;
        if (propDefs === undefined) {
            const s = new Set();
            for (const propAction of (config.propActions || []).flat()) {
                const props = getDestructArgs(propAction);
                for (const prop of props) {
                    if (xp.props[prop] === undefined && prop !== 'self') {
                        s.add(prop);
                    }
                }
            }
            const common = {
                type: Object,
                dry: true,
                async: true,
            };
            propDefs = {};
            Array.from(s).forEach(prop => {
                propDefs[prop] = common;
            });
        }
        const allPropDefs = { ...xp.props, ...propDefs };
        const slicedPropDefs = getSlicedPropDefs(allPropDefs);
        xc.letThereBeProps(newClass, slicedPropDefs, 'onPropChange');
        xc.define(newClass);
    }
}
X.observedAttributes = ['disabled'];
