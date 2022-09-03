import { INotify } from "./types";
import { XE, PropInfoExt } from './XE.js';
import {PropChangeInfo} from 'trans-render/lib/types';

export async function doNotify<MCProps>(self: XE, src: EventTarget, pci: PropChangeInfo, notify: INotify){
    const {toLisp} = self;
    const {prop, key, ov, nv}: {prop: PropInfoExt<MCProps>, key: string, ov: any, nv: any} = pci;
    const {dispatch, echoTo, toggleTo, reflectTo, cloneTo, localeStringTo, parseTo, incTo, lengthTo, toFormValue, setTo} = notify;
    const lispName = toLisp(key);
    if(dispatch){
        src.dispatchEvent(new CustomEvent(lispName + '-changed', {
            detail:{
                oldValue: ov,
                value: nv,
            }
        }));
    }
    if(echoTo !== undefined){
        if(typeof echoTo === 'string'){
            (<any>src)[echoTo] = nv;
        }else{
            const {delay, key} = echoTo;
            if(delay){
                let echoDelayNum: number = typeof(delay) === 'number' ? delay : (<any>self)[delay];
                setTimeout(() => {
                    (<any>src)[key] = nv;
                }, echoDelayNum);
            }else{
                (<any>src)[key] = nv;
            }
        }
    }
    if(incTo !== undefined){
        const {doIncTo} = await import('./doIncTo.js');
        doIncTo(self, src, pci, notify, incTo);
    }
    if(nv !== undefined && cloneTo !== undefined){
        (<any>src)[cloneTo] = structuredClone(nv);
    }

    if(toggleTo !== undefined){
        if(typeof toggleTo === 'string'){
            (<any>src)[toggleTo] = !nv;
        }else{
            const {delay, key} = toggleTo;
            if(delay){
                const toggleDelayNum: number = typeof(delay) === 'number' ? delay : (<any>self)[delay];
                setTimeout(() => {
                    (<any>src)[key] = !nv;
                }, toggleDelayNum);
            }else{
                (<any>src)[key] = !nv;
            }
        }

    }
    if(parseTo !== undefined){
        const {as, key} = parseTo;
        let nnv = nv;
        switch(as){
            case 'date':
                nnv = new Date(nv);
                break;
            case 'number':
                nnv = Number(nv);
                break;
            case 'obj':
                nnv = JSON.parse(nv);
        }
        (<any>src)[key] = nnv;
    }
    if(localeStringTo !== undefined){
        const {key, locale, localeOptions} = localeStringTo;
        (<any>src)[key] = nv.toLocale(locale, localeOptions);
    }
    if(lengthTo !== undefined){
        let nnv: number | undefined = undefined;
        if(nv !==  undefined){
            nnv = nv.length;
        }
        (<any>src)[lengthTo] = nnv;
    }
    if(toFormValue){
        let nnv: string = typeof nv === 'object' ? JSON.stringify(nv) : nv.toString();
        (<any>src).internals_.setFormValue(nnv);
    }
    if(setTo !== undefined){
        const {key, val} = setTo;
        (<any>src)[key] = val;
    }
    
    if(reflectTo !== undefined){
        const {doReflectTo} = await import('./doReflectTo.js');
        doReflectTo(self, src, pci, notify, reflectTo, lispName);
        
    }

    return true;
}

export function getPropInfos(props: {[key: string]: PropInfoExt}, propsWithNotifications: [string, PropInfoExt][]){
    for(const keyAndpropInfoExt of propsWithNotifications){
        const key = keyAndpropInfoExt[0];
        //if(props[key] !== undefined) continue;  shouldn't happen
        const prop = props[key];
        const propInfoExt = keyAndpropInfoExt[1];
        const {notify} = propInfoExt;
        const keys: (keyof INotify & string)[] = ['cloneTo', 'echoTo', 'toggleTo', 'localeStringTo']
        for(const k of keys){
            makeProp(prop, (notify as any)[k], k === 'localeStringTo', props);
        }
    }
}

function makeProp(from: PropInfoExt, name: string | undefined, makeString = false, props: {[key: string]: PropInfoExt}){
    if(name === undefined) return;
    const newProp = {
        type: makeString ? 'String' : from.type,
        parse: false,
    } as PropInfoExt;
    props[name] = newProp;
}