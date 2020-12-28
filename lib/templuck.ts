export interface Maps{
    IdMaps: {[key: string] : symbol},
    PartMaps: {[key: string]: symbol},
    ClassMaps: {[key: string]: symbol}
}
function stamp(fragment: HTMLElement | DocumentFragment, attr: string, refs:{[key: string]: symbol}, cache: any){
    Array.from((fragment.getRootNode() as DocumentFragment).querySelectorAll(`[${attr}]`)).forEach(el =>{
        const val = (el as Element).getAttribute(attr)!;
        const sym = refs[val];
        if(sym !== undefined){
            cache[sym] = el;
        }
    });
    
}
export function templuck(fragment: HTMLElement | DocumentFragment, maps: Maps, cache: any){
    stamp(fragment, 'id', maps.IdMaps, cache);
    stamp(fragment, 'part', maps.PartMaps, cache);
    stamp(fragment, 'class', maps.ClassMaps, cache);
}