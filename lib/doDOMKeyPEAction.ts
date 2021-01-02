import {Reactor} from './Reactor.js';
import {applyPE} from './applyPE.js';
export function doDOMKeyPEAction(refs: any[], dependencies: string[], reactor: Reactor){
    const surface = reactor.surface;
    const aSurface = surface as any;
    const cache = aSurface[dependencies[0]];
    for(const ref of refs){
        const refKeys = Object.getOwnPropertySymbols(ref);
        for(const key of refKeys){
            applyPE(surface as HTMLElement, cache[key] as HTMLElement, ref[key]);
        }
    }
}