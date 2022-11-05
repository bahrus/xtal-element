import {IPropagator, IPropChg} from 'trans-render/froop/types';
import {INotify, PropInfoExt, IReflectTo, ICustomState} from './src/types';

export async function noteIf(instance: EventTarget, propagator: IPropagator, key: string, oldValue: any, value: any, notify: INotify, propInfo: PropInfoExt){
    //console.log({instance, propagator, key, oldValue, value, notify, propInfo});
    const {dispatch, echoTo, toggleTo, negateTo, reflectTo, cloneTo, localeStringTo, parseTo, incTo, lengthTo, toFormValue, setTo} = notify;
    if(dispatch !== undefined){
        const {camelToLisp} = await import('trans-render/lib/camelToLisp.js');
        const lispName = camelToLisp(key);
        instance.dispatchEvent(new CustomEvent(lispName + '-changed', {
            detail:{
                oldValue,
                value
            }
        }));
    }
    if(cloneTo !== undefined && value !== undefined){
        (<any>instance)[cloneTo] = structuredClone(value);
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
    if(toggleTo !== undefined){
        (<any>instance)[toggleTo] = !(<any>instance)[toggleTo];
    }
    if(echoTo || negateTo || incTo ){
        const {ifENI} = await import('./ifENI.js');
        await ifENI(instance, propagator, key, oldValue, value, notify, propInfo);
    }
    if(parseTo || reflectTo){
        const {ifPR} = await import('./ifPR.js');
        await ifPR(instance, propagator, key, oldValue, value, notify, propInfo);
    }


}