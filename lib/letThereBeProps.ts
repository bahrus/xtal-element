import {SlicedPropDefs, PropDef} from '../types.js';
import {camelToLisp} from 'trans-render/lib/camelToLisp.js';

let count = 0;
const base = 'H9Yse71zmEGbnOXN8KNMJw';
function defineSet<T extends HTMLElement = HTMLElement>(self: any, name: string, prop: PropDef, privateKey: string, nv: any, callbackMethodName?: keyof T){
    if(prop.dry){
        if(nv === self[privateKey]) return;
    }
    if(prop.reflect || (self.beReflective && self.beReflective.includes(name))){
        switch(prop.type){
            case Boolean:
                {
                    const nameIs = 'is' + name[0].toUpperCase() + name.substr(1);
                    const isUndefined = self.dataset[nameIs] === undefined;
                    if(nv && isUndefined){
                        self.dataset[nameIs] = '';
                    }else if(!isUndefined){
                        delete self.dataset[nameIs];
                    }
                }
                break;
            case String:
            case Number:{
                    const nameIs = name + 'Is';
                    if(nv !== undefined) self.dataset[nameIs] = nv;
                }
                break;

            case Object:
                {
                    const nameIs = name + 'Is';
                    if(nv !== undefined) self.dataset[nameIs] = JSON.stringify(nv);
                }
                break;
        }
    }
    self[privateKey] = nv;
    if(prop.log){
        console.log(prop, nv);
    }
    if(prop.debug) debugger;
    if(callbackMethodName !== undefined) self[callbackMethodName](name, prop, nv);
    if(prop.notify !== undefined && (!prop.stopNotificationIfFalsy || nv)){
        const eventInit: CustomEventInit = {
            detail: {
                value: nv
            }
        };
        Object.assign(eventInit, prop.notify);
        self.dispatchEvent(new CustomEvent(camelToLisp(name) + '-changed', eventInit));
    }
    if(prop.echoTo !== undefined){
        self[prop.echoTo] = nv;
    }
}
export function letThereBeProps<T extends HTMLElement = HTMLElement>(elementClass: {new(): T}, slicedPropDefs: SlicedPropDefs, callbackMethodName?: keyof T){
    const proto = elementClass.prototype;
    if(proto.xtalIgnore === undefined) proto.xtalIgnore = new Set<string>();
    const existingProps = Object.getOwnPropertyNames(proto);
    const props = slicedPropDefs.propDefs;
    for(const prop of props){
        if(prop.stopReactionsIfFalsy) proto.xtalIgnore.add(prop.name);
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
                    return this[privateKey];
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