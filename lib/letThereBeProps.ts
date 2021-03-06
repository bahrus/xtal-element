import {SlicedPropDefs, PropDef} from '../types.js';
import {camelToLisp} from 'trans-render/lib/camelToLisp.js';
import {structuralClone} from './structuralClone.js';

let count = 0;
const base = 'H9Yse71zmEGbnOXN8KNMJw';
function defineSet<T extends HTMLElement = HTMLElement>(self: any, name: string, prop: PropDef, privateKey: string, nv: any, callbackMethodName?: keyof T){
    if(prop.dry){
        if(nv === self[privateKey]) return;
    }
    if(prop.reflect || (self.beReflective && self.beReflective.includes(name))){
        const nameIs = name + 'Is';
        if(nv !== undefined) {
            if(prop.type === Boolean && self._internals !== undefined){
                const verb = nv ? 'add' : 'delete';
                self._internals.states[verb]('--' + name);
            }else{
                self.dataset[nameIs] = prop.type === Object ? JSON.stringify(nv) : nv;
            }
            
        }
    }
    let nv2 = nv;
    if(prop.clone) nv2 = structuralClone(nv);
    self[privateKey] = nv2;
    if(prop.log){
        console.log(prop, nv2);
    }
    if(prop.debug) debugger;
    if(callbackMethodName !== undefined) self[callbackMethodName](name, prop, nv2);
    if(prop.notify !== undefined && (!prop.stopNotificationIfFalsy || nv2)){
        const eventInit: CustomEventInit = {
            detail: {
                value: nv2
            }
        };
        Object.assign(eventInit, prop.notify);
        self.dispatchEvent(new CustomEvent(camelToLisp(name) + '-changed', eventInit));
    }
    if(prop.echoTo !== undefined){
        self[prop.echoTo] = nv2;
    }
}
export function letThereBeProps<T extends HTMLElement = HTMLElement>(elementClass: {new(): T}, slicedPropDefs: SlicedPropDefs, callbackMethodName?: keyof T){
    const proto = elementClass.prototype;
    if(proto.xtalIgnoreFalsy === undefined) proto.xtalIgnoreFalsy = new Set<string>();
    if(proto.xtalIgnoreTruthy === undefined) proto.xtalIgnoreTruthy = new Set<string>();
    const existingProps = Object.getOwnPropertyNames(proto);
    const props = slicedPropDefs.propDefs;
    for(const prop of props){
        if(prop.stopReactionsIfFalsy) proto.xtalIgnoreFalsy.add(prop.name);
        if(prop.stopReactionsIfTruthy) proto.xtalIgnoreTruthy.add(prop.name);
        const name = prop.name!;
        if(existingProps.includes(name)) return;
        const privateKey = '_' + name;
        if(prop.obfuscate){
            Object.defineProperty(proto, name, {
                get(){
                    return this[privateKey];
                },
                enumerable: true,
                configurable: true,
            });
            const alias = base + count++;
            prop.alias = alias;
            slicedPropDefs.propLookup[name]!.alias = alias;
            Object.defineProperty(proto, alias, {
                set(nv){
                    defineSet<T>(this, name, prop, privateKey, nv, callbackMethodName);
                },
                enumerable: true,
                configurable: true,
            })
        }else{
            Object.defineProperty(proto, name, {
                get(){
                    const returnObj = this[privateKey];
                    const transience = prop.transience;
                    if(transience !== undefined && returnObj !== undefined){
                        if(transience === 0){
                            delete this[privateKey];
                        }
                        setTimeout(() => {
                            delete this[privateKey];
                        }, transience);
                    }
                    return returnObj;
                },
                set(nv){
                    defineSet<T>(this, name, prop, privateKey, nv, callbackMethodName);
                },
                enumerable: true,
                configurable: true,
            });
        }

    }
}