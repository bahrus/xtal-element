import {InstSvc} from 'trans-render/froop/InstSvc.js';
import {XEArgs} from './types';
import {mse, npb} from 'trans-render/froop/const.js';
import { INewPropagator } from 'trans-render/froop/types';

export class NotifySvc extends InstSvc{
    constructor(public args: XEArgs){
        super();
        args.definer!.addEventListener(mse, () => {
            console.log('call #do');
            this.#do(args);
        }, {once: true});
    }

    async #do(args: XEArgs){
        const {services} = args;
        const {propper} = services!
        propper.addEventListener(npb, async e => {
            console.log({npb});
            const propEvent = (e as CustomEvent).detail as INewPropagator;
            const {instance, propagator} = propEvent;
            if(propagator.eth === undefined) propagator.eth = new Map();
            if(propagator.tth === undefined) propagator.tth = new Map();
            const {notarize} = await import('./notarize.js');
            notarize(instance, propagator, args);
            this.instanceResolved = instance;
        });
        await propper.resolve();
        console.log('resolved');
        this.resolved = true;
    }
} 