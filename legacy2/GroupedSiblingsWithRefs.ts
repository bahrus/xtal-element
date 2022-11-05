import {GroupedSiblings} from './GroupedSiblings.js';
import {lispToCamel} from 'trans-render/lib/lispToCamel.js';
export class GroupedSiblingsWithRefs extends GroupedSiblings{
    createRefs(fragment: DocumentFragment | HTMLElement){
        const elementRefEnding = '-element-ref';
        for(const name of this.getAttributeNames()){
            if((name[0] === '-') && name.endsWith(elementRefEnding)){
                let elementName = name.substr(1, name.length - elementRefEnding.length - 1);
                const key = lispToCamel(name.substr(1));
                const currentVal = (<any>this)[key];
                const matchingEl = fragment.querySelector(elementName);
                if(matchingEl !== null){
                    
                    (<any>this)[key] = matchingEl;
                    if(currentVal !== undefined && !(currentVal instanceof HTMLElement)){
                        Object.assign(matchingEl, currentVal);
                    }
                }else{
                    //release DOM element from memory
                    if(currentVal instanceof HTMLElement){
                        delete ((<any>this)[key]);
                    }
                }
            }
        }
    }
}