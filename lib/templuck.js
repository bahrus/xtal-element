function stamp(fragment, attr, refs, cache) {
    Array.from(fragment.getRootNode().querySelectorAll(`[${attr}]`)).forEach(el => {
        const val = el.getAttribute(attr);
        const sym = refs[val];
        if (sym !== undefined) {
            cache[sym] = el;
        }
    });
}
export function templuck(fragment, maps, cache) {
    stamp(fragment, 'id', maps.IdMaps, cache);
    stamp(fragment, 'part', maps.PartMaps, cache);
    stamp(fragment, 'class', maps.ClassMaps, cache);
}
