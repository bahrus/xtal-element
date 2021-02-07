import {Rx} from './Rx.js';
import {ReactiveSurface, ProcessorMap, RHSProcessorCtor, BothProcessor, LHSProcessorCtor} from '../types.js';
export {ReactiveSurface, PSDo, RHSProcessorCtor, LHSProcessorCtor} from '../types.js';
export class RxSuppl extends  Rx{

    constructor(public surface: ReactiveSurface , public PSMap: ProcessorMap[]) {
        super(surface);
    }

    async doPS(lhs: any, rhs: any, args: string[] | undefined){
        const processor = getProcessor(lhs, rhs, this.PSMap);
        if(processor !== undefined) {
            const ctor = processor.ctor;
            switch(typeof ctor){
                case 'function':
                    const processorInstance = new ctor();
                    processorInstance.do(rhs, args, this);
                    break;
                case 'object':
                    ctor.do(rhs, args, this);
                    break;
            }

        }
    }
}

export function matchType(val: any, processor: ProcessorMap, member: keyof BothProcessor){
    let typOfProcessor: any;
    switch(member){
        case 'lhsType':
            typOfProcessor = (processor as LHSProcessorCtor).lhsType;
            break;
        case 'rhsType':
            typOfProcessor = (processor as RHSProcessorCtor).rhsType;
            break;
    }
    if(typOfProcessor === undefined) return 0;
    switch(typeof val){
        case 'object':
            return val instanceof typOfProcessor ? 1 : -1; 
        case 'string':
            return typOfProcessor === String ? 1 : -1;
        case 'number':
            return typOfProcessor === Number ? 1 : -1;
        case 'boolean':
            return typOfProcessor === Boolean ? 1 : -1;
        case 'symbol':
            return typOfProcessor === Symbol ? 1 : -1;
        case 'bigint':
            return typOfProcessor === BigInt ? 1 : -1;
    }
    return 0;
}

export function getProcessor(lhs: any, rhs: any, processorMappings: ProcessorMap[]){
    for(const processor of processorMappings){
        const lhsMatch = matchType(lhs, processor, 'lhsType');
        const rhsMatch = matchType(rhs, processor, 'rhsType');
        if(lhsMatch + rhsMatch > 0) return processor;
    }
    
}