import {InstSvc} from 'trans-render/froop/InstSvc.js';
import {XEArgs} from '../types.js';
import {mse, xsr} from 'trans-render/froop/const.js';
import { INewPropagator } from 'trans-render/froop/types';
import {notarize} from './notarize.js';
export class NotifySvc extends InstSvc{
    constructor(public args: XEArgs){
        super();
        args.definer!.addEventListener(mse, () => {
            this.#do(args);
        }, {once: true});
    }

    async #do(args: XEArgs){
        const {services} = args;
        const {propper} = services!
        propper.addEventListener(xsr, async e => {
            const propEvent = (e as CustomEvent).detail as INewPropagator;
            const {instance, propagator} = propEvent;
            if(propagator.eth === undefined) propagator.eth = new Map();
            if(propagator.tth === undefined) propagator.tth = new Map();
            notarize(instance, propagator, args);
            this.instanceResolved = instance;
        });
        await propper.resolve();
        this.resolved = true;
    }
} 