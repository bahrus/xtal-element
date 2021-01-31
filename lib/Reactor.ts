import {Rx} from './Rx.js';
import {ReactiveSurface, ProcessorMap, getProcessor} from '../types.d.js';
export {ReactiveSurface, PSDo} from '../types.d.js';
export class Reactor extends  Rx{

    constructor(public surface: ReactiveSurface , public PSMap: ProcessorMap[], public getProcessor?: getProcessor) {
        super(surface);
    }

    async doPS(returnVal: any, args: string[] | undefined){
        let processorGetter: getProcessor | undefined = this.getProcessor;
        if(processorGetter === undefined){
            const {getProcessor} = await import('./getProcessor.js');
            processorGetter = getProcessor;
        }
        const processor = processorGetter(returnVal, this.PSMap);
        if(processor !== undefined) {
            const ctor = processor.ctor;
            switch(typeof ctor){
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