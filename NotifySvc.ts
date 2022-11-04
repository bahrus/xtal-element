import {InstResSvc} from 'trans-render/froop/InstResSvc.js';
import {XEArgs} from './types';
import {mse, npb} from 'trans-render/froop/const.js';
import { INewPropBag } from 'trans-render/froop/types';

export class NotifySvc extends InstResSvc{
    constructor(public args: XEArgs){
        super();
        args.main!.addEventListener(mse, () => {
            this.#do(args);
        }, {once: true});
    }

    async #do(args: XEArgs){
        const {services} = args;
        const {addProps} = services!
        await addProps.resolve();
        addProps.addEventListener(npb, async e => {
            const propBagEvent = (e as CustomEvent).detail as INewPropBag;
            const {instance, propBag} = propBagEvent;
            const {hookupNotifications} = await import('./hookupNotifications.js');
            hookupNotifications(instance, propBag, args);
            this.instanceResolved = instance;
        });
        this.resolved = true;
    }
} 