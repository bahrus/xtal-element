import {IPropagator, IPropChg} from 'trans-render/froop/types';
import {INotify, PropInfoExt, IReflectTo, ICustomState} from './src/types';

export async function noteIf(instance: EventTarget, propagator: IPropagator, key: string, oldValue: any, value: any, notify: INotify, propInfo: PropInfoExt){
    const {dispatch, echoTo, toggleTo, reflectTo, cloneTo, localeStringTo, parseTo, incTo, lengthTo, toFormValue, setTo} = notify;
    if(dispatch){
        const {camelToLisp} = await import('trans-render/lib/camelToLisp.js');
        const lispName = camelToLisp(key);
        instance.dispatchEvent(new CustomEvent(lispName + '-changed', {
            detail:{
                oldValue,
                value
            }
        }));
    }
    if(echoTo !== undefined){
        if(typeof echoTo === 'string'){
            (<any>instance)[echoTo] = value;
        }else{
            const {delay, key} = echoTo;
            if(delay){
                let echoDelayNum: number = typeof(delay) === 'number' ? delay : (<any>self)[delay];
                const {eth} = propagator;
                if(eth!.has(key)){
                    clearTimeout(eth!.get(key));
                }
                const t = setTimeout(() => {
                    (<any>instance)[key] = value;
                }, echoDelayNum);
                eth!.set(key, t);
            }else{
                (<any>instance)[key] = value;
            }
        }
    }
    if(toggleTo !== undefined){
        if(typeof toggleTo === 'string'){
            (<any>instance)[toggleTo] = !value;
        }else{
            const {delay, key} = toggleTo;
            if(delay){
                const toggleDelayNum: number = typeof(delay) === 'number' ? delay : (<any>self)[delay];
                const {tth} = propagator;
                if(tth!.has(key)){
                    clearTimeout(tth!.get(key));
                }
                
                const t = setTimeout(() => {
                    (<any>instance)[key] = !value;
                }, toggleDelayNum);
            }else{
                (<any>instance)[key] = !value;
            }            
        }
    }
    if(incTo !== undefined){
        if(typeof incTo === 'string'){
            (<any>instance)[incTo] += 1;
            return;
        }
        const {step, key: toKey, lt, ltOrEq, loop, min, notifyWhenMax} = incTo;
        const byVal: number = typeof(step) === 'undefined' ? 1 :
            typeof(step) === 'number' ? step : 
                (<any>instance)[step];
        let nv = (<any>instance)[key] + byVal;
        const loopVal = typeof(loop) === 'boolean' ? loop : (<any>instance)[loop!];
        const hasUBound = lt !== undefined || ltOrEq !== undefined;
        if(hasUBound){
            const ltUnion = lt || ltOrEq;
            const ubound = typeof(ltUnion) === 'number' ? ltUnion : (<any>instance)[ltUnion!];
            if((lt !== undefined && nv >= ubound) || nv > ubound){
                //exceeded the max
                if(loopVal){
                    const minVal = min === undefined ? 0 : typeof(min) === 'number' ? min : (<any>instance)[min];
                    nv = minVal;
                }else if(notifyWhenMax === undefined){
                    return;
                }else{
                    await noteIf(instance, propagator, key, oldValue, value, notifyWhenMax, propInfo)
                    return;
                }
            }
        }
        (<any>instance)[toKey] = nv;
    }
    if(value !== undefined && cloneTo !== undefined){
        (<any>instance)[cloneTo] = structuredClone(value);
    }
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
        }
        (<any>instance)[key] = nnv;
    }
    if(localeStringTo !== undefined){
        const {key, locale, localeOptions} = localeStringTo;
        (<any>instance)[key] = value.toLocale(locale, localeOptions);
    }
    if(lengthTo !== undefined){
        let nnv: number | undefined = undefined;
        if(value !==  undefined){
            nnv = value.length;
        }
        (<any>instance)[lengthTo] = nnv;
    }
    if(toFormValue){
        let nnv: string = typeof value === 'object' ? JSON.stringify(value) : value.toString();
        (<any>instance).internals_.setFormValue(nnv);
    }
    if(setTo !== undefined){
        const {key, val} = setTo;
        (<any>instance)[key] = val;
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
            const internals = (<any>instance).internals_;
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