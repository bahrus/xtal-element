import { Rx } from './Rx.js';
export class Reactor extends Rx {
    constructor(surface, PSMap, getProcessor) {
        super(surface);
        this.surface = surface;
        this.PSMap = PSMap;
        this.getProcessor = getProcessor;
    }
    async doPS(returnVal, args) {
        let processorGetter = this.getProcessor;
        if (processorGetter === undefined) {
            const { getProcessor } = await import('./getProcessor.js');
            processorGetter = getProcessor;
        }
        const processor = processorGetter(returnVal, this.PSMap);
        if (processor !== undefined) {
            const ctor = processor.ctor;
            switch (typeof ctor) {
                case 'function':
                    const processorInstance = new ctor();
                    processorInstance.do(returnVal, args, this);
                    break;
                case 'object':
                    ctor.do(returnVal, args, this);
                    break;
            }
        }
    }
}
