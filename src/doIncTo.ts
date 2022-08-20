import { INotify, IInc } from "./types";
import { XE, PropInfoExt } from './XE.js';
import {PropChangeInfo} from 'trans-render/lib/types';
import {doNotify} from './doNotify.js';

export async function doIncTo<MCProps = any>(self: XE, src: EventTarget, pci: PropChangeInfo, notify: INotify, incTo: string | IInc<MCProps>){
    if(typeof incTo === 'string'){
        (<any>src)[incTo] += 1;
        return;
    }
    const {step, key, lt, ltOrEq, loop, min, notifyWhenMax} = incTo;
    const byVal: number = typeof(step) === undefined ? 1 :
        typeof(step) === 'number' ? step : 
            (<any>self)[step];
    let nv = (<any>src)[key];
    const loopVal = typeof(loop) === 'boolean' ? loop : (<any>src)[loop];
    const hasUBound = lt !== undefined || ltOrEq !== undefined;
    if(hasUBound){
        const ltUnion = lt || ltOrEq;
        const ubound = typeof(ltUnion) === 'number' ? ltUnion : (<any>self)[ltUnion];
        if((lt !== undefined && nv >= ubound) || nv > ubound){
            //exceeded the max
            if(loopVal){
                nv = min;
            }else if(notifyWhenMax === undefined){
                return;
            }else{
                doNotify(self, src, pci, notifyWhenMax)
                return;
            }
        }
    }
    (<any>src)[key] = nv;
}