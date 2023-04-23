import { InstSvc } from 'trans-render/froop/InstSvc.js';
import { mse, xsr } from 'trans-render/froop/const.js';
export class NotifySvc extends InstSvc {
    args;
    constructor(args) {
        super();
        this.args = args;
        args.definer.addEventListener(mse, () => {
            this.#do(args);
        }, { once: true });
    }
    async #do(args) {
        const { services } = args;
        const { propper } = services;
        propper.addEventListener(xsr, async (e) => {
            const propEvent = e.detail;
            const { instance, propagator } = propEvent;
            if (propagator.eth === undefined)
                propagator.eth = new Map();
            if (propagator.tth === undefined)
                propagator.tth = new Map();
            const { notarize } = await import('./notarize.js');
            notarize(instance, propagator, args);
            this.instanceResolved = instance;
        });
        await propper.resolve();
        this.resolved = true;
    }
}
