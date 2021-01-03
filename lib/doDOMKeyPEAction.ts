import {Reactor} from './Reactor.js';
import {applyPE} from './applyPE.js';
export function doDOMKeyPEAction(refs: any[], dependencies: string[], reactor: Reactor){
    const surface = reactor.surface;
    const aSurface = surface as any;
    const cache = aSurface[dependencies[0]];
    let lastNonDittoVal = undefined;
    for(const ref of refs){
        const refKeys = Object.getOwnPropertySymbols(ref);
        for(const key of refKeys){
            let val = ref[key];
            if(val === undefined) continue;
            switch(typeof val){
                case 'string':
                    if(val==='"' && lastNonDittoVal !== undefined){
                        val = lastNonDittoVal;
                    }else{
                        (cache[key] as HTMLElement).textContent = val;
                        continue;
                    }
                case 'object':
                    lastNonDittoVal = val;
                    break;
            }
            applyPE(surface as HTMLElement, cache[key] as HTMLElement, lastNonDittoVal);
        }
    }
}