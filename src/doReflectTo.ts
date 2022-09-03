import { INotify, IReflectTo } from "./types";
import { XE, PropInfoExt } from './XE.js';
import {PropChangeInfo} from 'trans-render/lib/types';

export async function doReflectTo<MCProps = any>(self: XE, src: EventTarget, pci: PropChangeInfo, notify: INotify, reflectTo: string | IReflectTo<MCProps>, lispName: string){
    const {toLisp} = self;
    let reflectToObj: IReflectTo<MCProps> = typeof reflectTo === 'string' ? {
        customState: {
            nameValue: reflectTo
        }
    } : reflectTo;
    if(reflectToObj.dataAttr){
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