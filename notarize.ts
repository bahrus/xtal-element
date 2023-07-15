import {IPropagator, IPropChg} from 'trans-render/froop/types';
import {pc} from 'trans-render/froop/const.js';
import {XEArgs} from './types';
import {INotify, PropInfoExt, IReflectTo, ICustomState} from './types';
import { PropInfo, } from 'trans-render/lib/types';

export function notarize(instance: EventTarget, propagator: IPropagator, args: XEArgs){
    propagator.addEventListener(pc, async e => {
        const chg = (e as CustomEvent).detail as IPropChg;
        const {key, oldVal, newVal} = chg;
        const {services} = args;
        const {itemizer} = services!;
        if(!itemizer.resolved){
            await itemizer.resolve();
        }
        
        const {nonDryProps} = itemizer;
        const propInfo = itemizer.propInfos[key] as PropInfoExt;
        const {notify} = propInfo;
        if(notify === undefined) return;
        if(!nonDryProps.has(key)){
            if(oldVal === newVal) return;
        }
        const {noteIf} = await import('./noteIf.js');
        await noteIf(instance, propagator, key, oldVal, newVal, notify, propInfo);
    });

}


