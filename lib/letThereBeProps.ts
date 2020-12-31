import {PropDef} from '../types.js';
import {camelToLisp} from './camelToLisp.js';

export function letThereBeProps(elementClass: any, props: PropDef[], callbackMethodName?: string){
    const proto = elementClass.prototype;
    const existingProps = Object.getOwnPropertyNames(proto);
    for(const prop of props){
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
                if(prop.reflect){
                    switch(prop.type){
                        case Boolean:
                            {
                                const isUndefined = this.dataset[name] === undefined;
                                if(nv && isUndefined){
                                    this.dataset[name] = '';
                                }else if(!isUndefined){
                                    delete this.dataset[name];
                                }
                            }
                            break;
                        case String:
                        case Number:
                            if(nv !== undefined) this.dataset[name] = nv;
                            break;
                        case Object:
                            if(nv !== undefined) this.dataset[name] = JSON.stringify(nv);
                            break;
                    }
                }
                this[privateKey] = nv;
                if(prop.log){
                    console.log(prop, nv);
                }
                if(prop.debug) debugger;
                if(callbackMethodName !== undefined) this[callbackMethodName](name, prop);
                if(prop.notify !== undefined){
                    const eventInit: CustomEventInit = {
                        detail: {
                            value: nv
                        }
                    };
                    Object.assign(eventInit, prop.notify);
                    this.dispatchEvent(new CustomEvent(camelToLisp(name) + '-changed'), eventInit);
                }
            },
            enumerable: true,
            configurable: true,
        });
    }
}