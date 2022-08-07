import { INotify } from "./types";
import { XE, PropInfoExt } from './XE.js';
import {PropChangeInfo} from 'trans-render/lib/types';

export async function doNotify<MCProps>(self: XE, src: EventTarget, pci: PropChangeInfo, notify: INotify){
    const {toLisp} = self;
    const {prop, key, ov, nv}: {prop: PropInfoExt<MCProps>, key: string, ov: any, nv: any} = pci;
    const {dispatch, echoTo, toggleTo, toggleDelay, echoDelay, reflect, cloneTo, localeStringTo} = notify;
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
        if(echoDelay){
            let echoDelayNum: number = typeof(echoDelay) === 'number' ? echoDelay : (<any>self)[echoDelay];
            setTimeout(() => {
                (<any>src)[echoTo] = nv;
            }, echoDelayNum);
        }else{
            (<any>src)[echoTo] = nv;
        }
        
    }
    if(nv !== undefined && cloneTo !== undefined){
        (<any>src)[cloneTo] = structuredClone(nv);
    }
    if(toggleTo !== undefined){
        if(toggleDelay){
            const toggleDelayNum: number = typeof(toggleDelay) === 'number' ? toggleDelay : (<any>self)[toggleDelay];
            setTimeout(() => {
                (<any>src)[toggleTo] = !nv;
            }, toggleDelayNum);
        }else{
            (<any>src)[toggleTo] = !nv;
        }
    }
    if(localeStringTo !== undefined){
        const {key, locale, localeOptions} = localeStringTo;
        (<any>src)[key] = (<any>src).toLocale(locale, localeOptions);
    }
    if(reflect !== undefined){
        if(reflect.asAttr){
            (<any>src).inReflectMode = true;
            let val = pci.nv;
            let remAttr = false;
            switch(pci.prop.type){
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
    }
    return true;
}