import {CE} from 'trans-render/froop/CE.js';
import {CEArgs} from 'trans-render/froop/types';
import {Action, WCConfig} from 'trans-render/lib/types';
import {PropInfoExt} from './src/types';
import {XEArgs} from './types';

export class XE<
    TProps = any, TActions = TProps,
    TPropInfo extends PropInfoExt<TProps> = PropInfoExt<TProps>,
    TAction  extends Action<TProps> = Action<TProps>
> extends CE<TProps, TActions, TPropInfo, TAction>{


    override async addSvcClasses(args: CEArgs){
        await super.addSvcClasses(args);
        const config = args.config as WCConfig;
        const {propInfo} = config;
        if(propInfo === undefined) return;
        let foundNotify = false;
        for(const prop in propInfo){
            const propInfoExt = propInfo[prop] as PropInfoExt;
            if(propInfoExt.notify !== undefined){
                const xeArgs = args as XEArgs;
                const {servers} = xeArgs;
                const {NotifySvc} = await import('./NotifySvc.js');
                servers!.notify = NotifySvc;
                break;
            }
        }
        
    }



}