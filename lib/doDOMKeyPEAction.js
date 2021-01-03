import { applyPE } from './applyPE.js';
export function doDOMKeyPEAction(refs, dependencies, reactor) {
    const surface = reactor.surface;
    const aSurface = surface;
    const cache = aSurface[dependencies[0]];
    let lastNonDittoVal = undefined;
    for (const ref of refs) {
        const refKeys = Object.getOwnPropertySymbols(ref);
        for (const key of refKeys) {
            let val = ref[key];
            switch (typeof val) {
                case 'string':
                    if (val === '"' && lastNonDittoVal !== undefined) {
                        val = lastNonDittoVal;
                    }
                    else {
                        cache[key].textContent = val;
                        continue;
                    }
                case 'object':
                    lastNonDittoVal = val;
                    break;
            }
            applyPE(surface, cache[key], lastNonDittoVal);
        }
    }
}
