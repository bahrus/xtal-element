import { camelToLisp } from 'trans-render/lib/camelToLisp.js';
import { structuralClone } from './structuralClone.js';
let count = 0;
const base = 'H9Yse71zmEGbnOXN8KNMJw';
function defineSet(self, name, prop, privateKey, nv, callbackMethodName) {
    if (prop.dry) {
        if (nv === self[privateKey])
            return;
    }
    if (prop.reflect || (self.beReflective && self.beReflective.includes(name))) {
        const nameIs = name + 'Is';
        if (nv !== undefined) {
            self.dataset[nameIs] = prop.type === Object ? JSON.stringify(nv) : nv;
        }
    }
    let nv2 = nv;
    if (prop.clone)
        nv2 = structuralClone(nv);
    self[privateKey] = nv2;
    if (prop.log) {
        console.log(prop, nv2);
    }
    if (prop.debug)
        debugger;
    if (callbackMethodName !== undefined)
        self[callbackMethodName](name, prop, nv2);
    if (prop.notify !== undefined && (!prop.stopNotificationIfFalsy || nv2)) {
        const eventInit = {
            detail: {
                value: nv2
            }
        };
        Object.assign(eventInit, prop.notify);
        self.dispatchEvent(new CustomEvent(camelToLisp(name) + '-changed', eventInit));
    }
    if (prop.echoTo !== undefined) {
        self[prop.echoTo] = nv2;
    }
}
export function letThereBeProps(elementClass, slicedPropDefs, callbackMethodName) {
    const proto = elementClass.prototype;
    if (proto.xtalIgnore === undefined)
        proto.xtalIgnore = new Set();
    const existingProps = Object.getOwnPropertyNames(proto);
    const props = slicedPropDefs.propDefs;
    for (const prop of props) {
        if (prop.stopReactionsIfFalsy)
            proto.xtalIgnore.add(prop.name);
        const name = prop.name;
        if (existingProps.includes(name))
            return;
        const privateKey = '_' + name;
        if (prop.obfuscate) {
            Object.defineProperty(proto, name, {
                get() {
                    return this[privateKey];
                },
                enumerable: true,
                configurable: true,
            });
            const alias = base + count++;
            prop.alias = alias;
            slicedPropDefs.propLookup[name].alias = alias;
            Object.defineProperty(proto, alias, {
                set(nv) {
                    defineSet(this, name, prop, privateKey, nv, callbackMethodName);
                },
                enumerable: true,
                configurable: true,
            });
        }
        else {
            Object.defineProperty(proto, name, {
                get() {
                    const returnObj = this[privateKey];
                    const transience = prop.transience;
                    if (transience !== undefined && returnObj !== undefined) {
                        if (transience === 0) {
                            delete this[privateKey];
                        }
                        setTimeout(() => {
                            delete this[privateKey];
                        }, transience);
                    }
                    return returnObj;
                },
                set(nv) {
                    defineSet(this, name, prop, privateKey, nv, callbackMethodName);
                },
                enumerable: true,
                configurable: true,
            });
        }
    }
}
