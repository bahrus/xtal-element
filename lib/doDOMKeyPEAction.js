import { applyPE } from './applyPE.js';
export function doDOMKeyPEAction(refs, dependencies, reactor) {
    const surface = reactor.surface;
    const aSurface = surface;
    const cache = aSurface[dependencies[0]];
    for (const ref of refs) {
        const refKeys = Object.getOwnPropertySymbols(ref);
        for (const key of refKeys) {
            applyPE(surface, cache[key], ref[key]);
        }
    }
}
