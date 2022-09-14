import {CE, PropInfo} from 'trans-render/lib/CE.js';
export {PropInfo, TemplMgmtProps, Action} from 'trans-render/lib/types';
import {applyP} from 'trans-render/lib/applyP.js';
import {applyPEA} from 'trans-render/lib/applyPEA.js';
import {PropChangeInfo, PropChangeMoment, Action, PEAUnionSettings} from 'trans-render/lib/types.js';
import {PropInfoExt, DefineArgs} from './types.js';
export {PropInfoExt} from './types.js';

declare function structuredClone(inp: any): any;

export class XE<
    MCProps = any, MCActions = MCProps, 
    TPropInfo extends PropInfoExt<MCProps> = PropInfoExt<MCProps>, 
    TAction extends Action<MCProps> = Action<MCProps>> extends CE<MCProps, MCActions, TPropInfo, TAction
>{

    override doPA(self: this, src: EventTarget, pci: PropChangeInfo , m: PropChangeMoment){ 
        
        const {prop}: {prop: PropInfoExt<MCProps>} = pci;
        const {notify} = prop;
        if(notify !== undefined && (m === '+a' || m === '+qr')){
            (async () => {
                const {doNotify} = await import('./doNotify.js');
                return await doNotify<MCProps>(self, src, pci, notify);
            })(); 
                         
        }

    }


    override async api<MCProps, MCActions, TPropInfo>(args: DefineArgs<MCProps, MCActions, TPropInfo>, props: {[key: string]: PropInfoExt}){
        const propsWithNotifications: [string, PropInfoExt][] = [];
        for(const key in props){
            const propInfoExt = props[key];
            if(propInfoExt.notify !== undefined){
                propsWithNotifications.push([key, propInfoExt]);
            }
        }
        if(propsWithNotifications.length === 0) return;
        const {getPropInfos} = await import('./doNotify.js');
        getPropInfos(props, propsWithNotifications);
    }

    async apply(host: Element, target: any, returnVal: any, proxy: any){
        const dest = proxy !== undefined ? proxy : target;
        if(dest instanceof Element){
            if(Array.isArray(returnVal)){
                await applyPEA(host, dest, returnVal as PEAUnionSettings);
            }else{
                await applyP(dest, [returnVal]);
            }
        }else{
            Object.assign(dest, returnVal);
        }
    }

    async postHoc(self: this, action: Action, host: Element, returnVal: any, proxy: any){
        if(action.target !== undefined){
            let newTarget = (<any>host)[action.target];
            if(newTarget === undefined) {
                console.warn('No target found');
                return;
            }
            if(newTarget instanceof NodeList){
                newTarget = Array.from(newTarget);
            }
            if(Array.isArray(newTarget)){
                for(const subTarget of newTarget){
                    let subTargetRef = subTarget;
                    if(subTargetRef.deref){
                        subTargetRef = subTargetRef.deref();
                    }
                    await self.apply(host, subTargetRef, returnVal, proxy);
                }
            }else{
                await self.apply(host, newTarget, returnVal, proxy);
            }
        }else{
            await self.apply(host, host, returnVal, proxy);
        }
        
    }
} 
