import { applyPE } from 'trans-render/lib/applyPE.js';
export class DOMKeyPE {
    constructor(domCacheProp = 'domCache') {
        this.domCacheProp = domCacheProp;
    }
    checkForDOMSubstitution(surface, el, val, key) {
        if (typeof (val) === 'symbol' && val.description !== undefined) {
            const newEl = document.createElement(val.description);
            el.insertAdjacentElement('afterend', newEl);
            const cache = surface[this.domCacheProp];
            const pinned = cache[key];
            if (Array.isArray(pinned)) {
                const idx = pinned.findIndex(test => test === el);
                pinned[idx] = newEl;
            }
            else {
                cache[key] = newEl;
            }
            el.remove();
        }
        else {
            this.apply(surface, el, val);
        }
    }
    apply(surface, el, val) {
        applyPE(surface, el, val);
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
                    const cacheKey = cache[key];
                    switch (typeof val) {
                        case 'string':
                            if (val === '"' && lastNonDittoVal !== undefined) {
                                val = lastNonDittoVal;
                            }
                            else {
                                cacheKey.textContent = val;
                                continue;
                            }
                            break;
                        case 'number':
                            cacheKey.textContent = val.toString();
                            continue;
                            break;
                        case 'object':
                            lastNonDittoVal = val;
                            break;
                    }
                    const matchOrMatches = cacheKey;
                    if (Array.isArray(matchOrMatches)) {
                        for (var el of matchOrMatches) {
                            this.checkForDOMSubstitution(surface, el, lastNonDittoVal, key);
                            //this.apply(surface as HTMLElement, el as HTMLElement, lastNonDittoVal);
                        }
                    }
                    else {
                        this.checkForDOMSubstitution(surface, matchOrMatches, lastNonDittoVal, key);
                        //this.apply(surface as HTMLElement, matchOrMatches as HTMLElement, lastNonDittoVal);
                    }
                }
            }
        }
    }
}
