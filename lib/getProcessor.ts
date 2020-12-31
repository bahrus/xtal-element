import {ProcessorMap} from '../types.d.js';

export function getProcessor(value: any, processorMappings: ProcessorMap[]){
    switch(typeof value){
        case 'string':
            return processorMappings.find(x => x.type === String);
        case 'boolean':
            return processorMappings.find(x => x.type === Boolean);
        case 'function':
            return processorMappings.find(x => x.type === Function);
        case 'number':
            return processorMappings.find(x => x.type === Number);
        case 'object':
            if(Array.isArray(value)){
                return processorMappings.find(x => x.type === Array);
            }
            if(value instanceof HTMLElement){
                return processorMappings.find(x => x.type === HTMLElement)
            }
            //other sub cases?
            return processorMappings.find(x => x.type === Object);
    }
}