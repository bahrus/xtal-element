import {IPropagator, IPropChg} from 'trans-render/froop/types';
import {pc} from 'trans-render/froop/const.js';
import {XEArgs} from './types';
import {INotify, PropInfoExt, IReflectTo} from './src/types';
import { PropInfo } from './src/XE';

export function notarize(instance: EventTarget, propagator: IPropagator, args: XEArgs){
    propagator.addEventListener(pc, async e => {
        const chg = (e as CustomEvent).detail as IPropChg;
        const {key, oldVal, newVal} = chg;
        //console.log({key, oldVal, newVal});
        const {services} = args;
        const {itemizer} = services!;
        await itemizer.resolve();
        const {nonDryProps} = itemizer;
        const propInfo = itemizer.propInfos[key] as PropInfoExt;
        const {notify} = propInfo;
        if(notify === undefined) return;
        if(!nonDryProps.has(key)){
            if(oldVal === newVal) return;
        }
        await noteIf(instance, propagator, key, oldVal, newVal, notify, propInfo);
    });

}

export async function noteIf(instance: EventTarget, propagator: IPropagator, key: string, oldValue: any, value: any, notify: INotify, propInfo: PropInfo){
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
        let reflectToObj: IReflectTo = typeof reflectTo === 'string' ? {
            customState: {
                nameValue: reflectTo
            }
        } : reflectTo;
        const {attr, customState} = reflectToObj;
        
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
                (<any>src).removeAttribute(lispName);
            }else{
                (<any>src).setAttribute(lispName, val);
            }
            (<any>src).inReflectMode = false;
        }
        if(customState !== undefined){
            const internals = (<any>src).internals_;
            if(internals === undefined) return;
            const customStateObj: ICustomState<MCProps> = typeof customState === 'string' ? {
                nameValue: customState,
            } : customState;
            const {nameValue, falsy, truthy} = customStateObj;
            if(nameValue !== undefined){
                const valAsLisp = toLisp(val.toString());
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
