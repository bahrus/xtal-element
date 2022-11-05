import { INotify, IReflectTo, ICustomState} from "./types";
import { XE, PropInfoExt } from './XE.js';
import {PropChangeInfo} from 'trans-render/lib/types';

export async function doReflectTo<MCProps = any>(self: XE, src: EventTarget, pci: PropChangeInfo, notify: INotify, reflectTo: string | IReflectTo<MCProps>, lispName: string){
    const {toLisp} = self;
    let reflectToObj: IReflectTo<MCProps> = typeof reflectTo === 'string' ? {
        customState: {
            nameValue: reflectTo
        }
    } : reflectTo;
    const {attr: dataAttr, customState} = reflectToObj;
    let val = pci.nv;
    if(dataAttr){
        (<any>src).inReflectMode = true;
        
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