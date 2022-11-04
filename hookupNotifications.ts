import {IPropBag, IPropChg} from 'trans-render/froop/types';
import {pc} from 'trans-render/froop/const.js';
import {XEArgs} from './types';
import {INotify, PropInfoExt} from './src/types';
export function hookupNotifications(instance: EventTarget, propBag: IPropBag, args: XEArgs){
    propBag.addEventListener(pc, async e => {
        const chg = (e as CustomEvent).detail as IPropChg;
        const {key, oldVal, newVal} = chg;
        //console.log({key, oldVal, newVal});
        const {services} = args;
        const {createPropInfos} = services!;
        await createPropInfos.resolve();
        const {nonDryProps} = createPropInfos;
        const propInfo = createPropInfos.propInfos[key] as PropInfoExt;
        const {notify} = propInfo;
        if(notify === undefined) return;
        if(!nonDryProps.has(key)){
            if(oldVal === newVal) return;
        }
        await doNotify(instance, key, oldVal, newVal, notify);
    });

}

export async function doNotify(instance: EventTarget, key: string, oldValue: any, value: any, notify: INotify){
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
                if((<any>echoTo)[echoSym] !== undefined){
                    clearTimeout((<any>echoTo)[echoSym]);
                }
                (<any>echoTo)[echoSym] = setTimeout(() => {
                    (<any>instance)[key] = value;
                }, echoDelayNum);
            }else{
                (<any>src)[key] = nv;
            }
        }
    }
}

const echoSym = Symbol();