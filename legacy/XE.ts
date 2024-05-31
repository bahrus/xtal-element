import {CE} from 'trans-render/froop/CE.js';
import {CEArgs} from 'trans-render/froop/types';
import {Action, WCConfig} from 'trans-render/lib/types';
import {PropInfoExt} from './types.js';
import {XEArgs} from './types.js';
export {ActionOnEventConfigs} from 'trans-render/froop/types.d.js';

export class XE<
    TProps = any, TActions = TProps,
    TPropInfo extends PropInfoExt<TProps> = PropInfoExt<TProps>,
    TAction  extends Action<TProps> = Action<TProps>
> extends CE<TProps, TActions, TPropInfo, TAction>{


    override async addSvcClasses(args: CEArgs){
        if(args.servers === undefined) args.servers = {};
        const config = args.config as WCConfig;
        const {propInfo} = config;
        if(propInfo === undefined) return;
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
        await super.addSvcClasses(args);
    }



}