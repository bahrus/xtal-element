import { applyPE } from 'trans-render/lib/applyPE.js';
export class DOMKeyPE {
    constructor(domCacheProp = 'domCache') {
        this.domCacheProp = domCacheProp;
    }
    apply(surface, el, ref) {
        applyPE(surface, el, ref);
    }
    do(refs, dependencies, reactor) {
        const surface = reactor.surface;
        const aSurface = surface;
        const cache = aSurface[this.domCacheProp];
        let lastNonDittoVal = undefined;
        for (const ref of refs) {
            if (Array.isArray(ref)) {
                this.apply(surface, surface, ref);
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
                    const matchOrMatches = cache[key];
                    if (Array.isArray(matchOrMatches)) {
                        for (var el of matchOrMatches) {
                            this.apply(surface, el, lastNonDittoVal);
                        }
                    }
                    else {
                        this.apply(surface, matchOrMatches, lastNonDittoVal);
                    }
                }
            }
        }
    }
}
