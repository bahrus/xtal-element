import {IPropagator, IPropChg} from 'trans-render/froop/types';
import {INotify, PropInfoExt, IReflectTo, ICustomState, Config} from './types.js';

export async function ifENI(
    instance: EventTarget, propagator: IPropagator, key: string, oldValue: any, 
    value: any, notify: INotify, propInfo: PropInfoExt, config: Config){
    const {echoTo, negateTo, incTo, setTo, toggleTo} = notify;
    if(echoTo !== undefined){
        if(typeof echoTo === 'string'){
            (<any>instance)[echoTo] = value;
        }else{
            const {delay, key} = echoTo;
            if(delay){
                const echoDelayNum: number = typeof(delay) === 'number' ? delay : (<any>instance)[delay];
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
    if(setTo !== undefined){
        const {key, val, delay} = setTo;
        if(delay){
            const setToDelayNum = typeof(delay) === 'number' ? delay : (<any>self)[delay] as number;
            setTimeout(() =>{
                (<any>instance)[key] = val;
            }, setToDelayNum);
        }else{
            (<any>instance)[key] = val;
        }
       
    }
    if(toggleTo !== undefined){
        if(typeof toggleTo === 'string'){
            (<any>instance)[toggleTo] = !(<any>instance)[toggleTo];
        }else{
            const {delay, key} = toggleTo;
            if(delay){
                const toggleDelayNum = typeof(delay) === 'number' ? delay : (<any>self)[delay] as number;
                setTimeout(() => {
                    (<any>instance)[key] = !(<any>instance)[key];
                }, toggleDelayNum);
            }else{
                (<any>instance)[key] = !(<any>instance)[key];
            }
        }
       
    }
    if(negateTo !== undefined){
        if(typeof negateTo === 'string'){
            (<any>instance)[negateTo] = !value;
        }else{
            const {delay, key} = negateTo;
            if(delay){
                const negateDelayNum: number = typeof(delay) === 'number' ? delay : (<any>self)[delay];
                const {tth} = propagator;
                if(tth!.has(key)){
                    clearTimeout(tth!.get(key));
                }
                
                const t = setTimeout(() => {
                    (<any>instance)[key] = !value;
                }, negateDelayNum);
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
        let nv = (<any>instance)[toKey] + byVal;
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
                    const {noteIf} = await import('./noteIf.js');
                    await noteIf(instance, propagator, key, oldValue, value, notifyWhenMax, propInfo, config)
                    return;
                }
            }
        }
        (<any>instance)[toKey] = nv;
    }
}