import {RxSuppl} from './RxSuppl.js';
import {applyPE} from 'trans-render/lib/applyPE.js';
import {PEUnionSettings} from 'trans-render/lib/types.d.js';

export class DOMKeyPE{
    constructor(public domCacheProp: string = 'domCache'){}
    checkForDOMSubstitution(surface: HTMLElement, el: HTMLElement, val: any, key: symbol){
        const localName = val[0]?.localName;
        if(localName !== undefined){
            //if the existing element matches the one to replace it, don't do anything
            if(el.localName !== localName){
                const newEl = document.createElement(localName);
                el.insertAdjacentElement('afterend', newEl);
                const cache = (<any>surface)[this.domCacheProp];
                const pinned = cache[key];
                if(Array.isArray(pinned)){
                    const idx = pinned.findIndex(test => test === el);
                    pinned[idx] = newEl;
                }else{
                    cache[key] = newEl;
                }
                el.remove();
            }

        }
        this.apply(surface, el, val);
    }
    apply(surface: HTMLElement, el: HTMLElement, val: any){
        applyPE(surface, el, val as PEUnionSettings);
    }
    do(refs: any[], dependencies: string[], reactor: RxSuppl){
        const surface = reactor.surface;
        const aSurface = surface as any;
        const cache = aSurface[this.domCacheProp];
        let lastNonDittoVal = undefined;
        for(const ref of refs){
            if(Array.isArray(ref)){
                this.apply(surface as HTMLElement, surface as HTMLElement, ref);
            }else{
                const refKeys = Object.getOwnPropertySymbols(ref);
                for(const key of refKeys){
                    let val = ref[key];
                    if(val === undefined) continue;
                    const cacheKey = cache[key];
                    switch(typeof val){
                        case 'string':
                            if(val==='"' && lastNonDittoVal !== undefined){
                                val = lastNonDittoVal;
                            }else{
                                (cacheKey as HTMLElement).textContent = val;
                                continue;
                            }
                            break;
                        case 'number':
                            (cacheKey as HTMLElement).textContent = val.toString();
                            continue;
                            break;
                        case 'object':
                            lastNonDittoVal = val;
                            break;
                        

                    }
                    const matchOrMatches = cacheKey;
                    if(Array.isArray(matchOrMatches)){
                        for(var el of matchOrMatches){
                            this.checkForDOMSubstitution(surface as HTMLElement, el, lastNonDittoVal, key)
                        }
                    }else{
                        this.checkForDOMSubstitution(surface as HTMLElement, matchOrMatches as HTMLElement, lastNonDittoVal, key);
                    }
                }
            }

        }
    }
}