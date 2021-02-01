import { Rx } from './Rx.js';
export class Reactor extends Rx {
    constructor(surface, PSMap) {
        super(surface);
        this.surface = surface;
        this.PSMap = PSMap;
    }
    async doPS(lhs, rhs, args) {
        const processor = getProcessor(lhs, rhs, this.PSMap);
        if (processor !== undefined) {
            const ctor = processor.ctor;
            switch (typeof ctor) {
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
export function matchType(val, processor, member) {
    let typOfProcessor;
    switch (member) {
        case 'lhsType':
            typOfProcessor = processor.lhsType;
            break;
        case 'rhsType':
            typOfProcessor = processor.rhsType;
            break;
    }
    if (typOfProcessor === undefined)
        return 0;
    switch (typeof val) {
        case 'string':
            return typOfProcessor === String ? 1 : -1;
        case 'number':
            return typOfProcessor === Number ? 1 : -1;
        case 'boolean':
            return typOfProcessor === Boolean ? 1 : -1;
        default:
            return val instanceof typOfProcessor ? 1 : -1;
    }
}
export function getProcessor(lhs, rhs, processorMappings) {
    for (const processor of processorMappings) {
        const lhsMatch = matchType(lhs, processor, 'lhsType');
        const rhsMatch = matchType(rhs, processor, 'rhsType');
        if (lhsMatch + rhsMatch > 0)
            return processor;
    }
}
