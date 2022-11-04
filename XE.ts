import {CE} from 'trans-render/froop/CE.js';
import {CEArgs} from 'trans-render/froop/types';
import {Action} from 'trans-render/lib/types';
import {PropInfoExt} from './src/types';
import {XEArgs} from './types';

export class XE<
    TProps = any, TActions = TProps,
    TPropInfo extends PropInfoExt<TProps> = PropInfoExt<TProps>,
    TAction  extends Action<TProps> = Action<TProps>
> extends CE{


    override async addSvcClasses(args: CEArgs){
        super.addSvcClasses(args);
        const xeArgs = args as XEArgs;
        const {serviceClasses} = xeArgs;
        const {NotifySvc} = await import('./NotifySvc.js');
        serviceClasses.notify = NotifySvc;
    }

    override async addSvcs(args: CEArgs){
        super.addSvcs(args);
        const xeArgs = args as XEArgs;
        const {services, serviceClasses} = xeArgs;
        const {notify} = serviceClasses;
        services.notify = new notify!(xeArgs); 
    }


}