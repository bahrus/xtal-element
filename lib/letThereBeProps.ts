import {PropDef} from '../types.js';
import {camelToLisp} from 'trans-render/lib/camelToLisp.js';

export function letThereBeProps<T extends HTMLElement = HTMLElement>(elementClass: {new(): T}, props: PropDef[], callbackMethodName?: keyof T){
    const proto = elementClass.prototype;
    if(proto.xtalIgnore === undefined) proto.xtalIgnore = new Set<string>();
    const existingProps = Object.getOwnPropertyNames(proto);
    for(const prop of props){
        if(prop.stopReactionsIfFalsy) proto.xtalIgnore.add(prop.name);
        const name = prop.name!;
        if(existingProps.includes(name)) return;
        const privateKey = '_' + name;
        Object.defineProperty(proto, name, {
            get(){
                return this[privateKey];
            },
            set(nv){
                if(prop.dry){
                    if(nv === this[privateKey]) return;
                }
                if(prop.reflect || (this.beReflective && this.beReflective.includes(name))){
                    switch(prop.type){
                        case Boolean:
                            {
                                const nameIs = 'is' + name[0].toUpperCase() + name.substr(1);
                                const isUndefined = this.dataset[nameIs] === undefined;
                                if(nv && isUndefined){
                                    this.dataset[nameIs] = '';
                                }else if(!isUndefined){
                                    delete this.dataset[nameIs];
                                }
                            }
                            break;
                        case String:
                        case Number:{
                                const nameIs = name + 'Is';
                                if(nv !== undefined) this.dataset[nameIs] = nv;
                            }
                            break;

                        case Object:
                            {
                                const nameIs = name + 'Is';
                                if(nv !== undefined) this.dataset[nameIs] = JSON.stringify(nv);
                            }
                            break;
                    }
                }
                this[privateKey] = nv;
                if(prop.log){
                    console.log(prop, nv);
                }
                if(prop.debug) debugger;
                if(callbackMethodName !== undefined) this[callbackMethodName](name, prop, nv);
                if(prop.notify !== undefined && (!prop.stopNotificationIfFalsy || nv)){
                    const eventInit: CustomEventInit = {
                        detail: {
                            value: nv
                        }
                    };
                    Object.assign(eventInit, prop.notify);
                    this.dispatchEvent(new CustomEvent(camelToLisp(name) + '-changed', eventInit));
                }
                if(prop.echoTo !== undefined){
                    this[prop.echoTo] = nv;
                }
            },
            enumerable: true,
            configurable: true,
        });
    }
}