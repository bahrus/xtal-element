import {IPropagator, IPropChg} from 'trans-render/froop/types';
import {INotify, PropInfoExt, IReflectTo, ICustomState} from './types';

export async function ifPR(instance: EventTarget, propagator: IPropagator, key: string, oldValue: any, value: any, notify: INotify, propInfo: PropInfoExt){
    const {parseTo, reflectTo} = notify;

    if(parseTo !== undefined){
        const {as, key} = parseTo;
        let nnv = value;
        switch(as){
            case 'date':
                nnv = new Date(value);
                break;
            case 'number':
                nnv = Number(value);
                break;
            case 'obj':
                nnv = JSON.parse(value);
                break;
        }
        (<any>instance)[key] = nnv;
    }

    
    if(reflectTo !== undefined){
        const {camelToLisp} = await import('trans-render/lib/camelToLisp.js');
        const lispName = camelToLisp(key);
        let reflectToObj: IReflectTo = typeof reflectTo === 'string' ? {
            customState: {
                nameValue: reflectTo
            }
        } : reflectTo;
        const {attr, customState} = reflectToObj;
        let val = value;
        if(attr){
            //(<any>in).inReflectMode = true;
            
            let remAttr = false;
            switch(propInfo.type){
                case 'Number':
                    val = val.toString();
                    break;
                case 'Boolean':
                    if(val){
                        val = ''
                    }else{
                        remAttr = true;
                    }
                    break;
                case 'Object':
                    val = JSON.stringify(val);
                    break;
            }
            if(remAttr){
                (<any>instance).removeAttribute(lispName);
            }else{
                (<any>instance).setAttribute(lispName, val);
            }
            //(<any>src).inReflectMode = false;
        }
        if(customState !== undefined){
            const internals = (<any>instance)._internals_;
            if(internals === undefined) return;
            const customStateObj: ICustomState = typeof customState === 'string' ? {
                nameValue: customState,
            } : customState;
            const {nameValue, falsy, truthy} = customStateObj;
            if(nameValue !== undefined){
                const valAsLisp = camelToLisp(val.toString());
                internals.states.add(`--${lispName}-${valAsLisp}`);
            }
            if(truthy){
                const verb = val ? 'add' : 'remove';
                internals.states[verb](`--${truthy}`);
            }
            if(falsy){
                const verb = val ? 'remove' : 'add';
                internals.states[verb](`--${falsy}`);
            }
        }
        
    }
}