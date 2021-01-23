import { xc } from './XtalCore.js';
import { xp } from './XtalPattern.js';
import { DOMKeyPE } from './DOMKeyPE.js';
import { getDestructArgs } from './getDestructArgs.js';
export class X extends HTMLElement {
    constructor() {
        super(...arguments);
        this.self = this;
    }
    onPropChange(name, prop, nv) {
        if (this.reactor === undefined) {
            this.reactor = new xc.Reactor(this, [
                {
                    type: Array,
                    ctor: DOMKeyPE
                }
            ]);
        }
        this.reactor.addToQueue(prop, nv);
    }
    static tend(config) {
        const propActions = [xp.manageMainTemplate, config.propActions, config.noShadow ? xp.appendClone : xp.createShadow];
        class newClass extends (config.class || X) {
            constructor() {
                super(...arguments);
                this.mainTemplate = config.mainTemplate;
                this.refs = config.refs;
                this.propActions = propActions;
            }
        }
        newClass.is = config.name;
        const nativeProps = xc.getPropDefs(xp.props);
        let propDefs = config.propDefs;
        if (propDefs === undefined) {
            const s = new Set();
            for (const propAction of config.propActions.flat()) {
                const props = getDestructArgs(propAction);
                for (const prop of props) {
                    if (nativeProps.findIndex(x => x.name === prop) === -1 && prop !== 'self') {
                        s.add(prop);
                    }
                }
            }
            propDefs = Array.from(s).map(prop => ({
                name: prop,
                type: Object,
                dry: true,
                async: true,
            }));
        }
        const allPropDefs = propDefs.concat(nativeProps);
        xc.letThereBeProps(newClass, allPropDefs, 'onPropChange');
        xc.define(newClass);
    }
}
