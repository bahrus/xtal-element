import {Reactor} from './Reactor.js';
import {applyPE} from 'trans-render/lib/applyPE.js';
import {PEUnionSettings} from '../types.d.js';

export class DOMKeyPE{
    constructor(public domCacheProp: string = 'domCache'){}
    do(refs: any[], dependencies: string[], reactor: Reactor){
        const surface = reactor.surface;
        const aSurface = surface as any;
        const cache = aSurface[this.domCacheProp];
        let lastNonDittoVal = undefined;
        for(const ref of refs){
            if(Array.isArray(ref)){
                applyPE(surface as HTMLElement, surface as HTMLElement, ref as PEUnionSettings);
            }else{
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
                            break;
                        case 'number':
                            (cache[key] as HTMLElement).textContent = val.toString();
                            continue;
                            break;
                        case 'object':
                            lastNonDittoVal = val;
                            break;
                    }
                    for(var el of cache[key]){
                        applyPE(surface as HTMLElement, el as HTMLElement, lastNonDittoVal);
                    }
                    
                }
            }
            

                

        }
    }
}