import { applyPE } from 'trans-render/lib/applyPE.js';
export class DOMKeyPE {
    constructor(domCacheProp = 'domCache') {
        this.domCacheProp = domCacheProp;
    }
    do(refs, dependencies, reactor) {
        const surface = reactor.surface;
        const aSurface = surface;
        const cache = aSurface[this.domCacheProp];
        let lastNonDittoVal = undefined;
        for (const ref of refs) {
            if (Array.isArray(ref)) {
                applyPE(surface, surface, ref);
            }
            else {
                const refKeys = Object.getOwnPropertySymbols(ref);
                for (const key of refKeys) {
                    let val = ref[key];
                    if (val === undefined)
                        continue;
                    switch (typeof val) {
                        case 'string':
                            if (val === '"' && lastNonDittoVal !== undefined) {
                                val = lastNonDittoVal;
                            }
                            else {
                                cache[key].textContent = val;
                                continue;
                            }
                            break;
                        case 'number':
                            cache[key].textContent = val.toString();
                            continue;
                            break;
                        case 'object':
                            lastNonDittoVal = val;
                            break;
                    }
                    for (var el of cache[key]) {
                        applyPE(surface, el, lastNonDittoVal);
                    }
                }
            }
        }
    }
}
