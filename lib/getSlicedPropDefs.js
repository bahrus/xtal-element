export function getSlicedPropDefs(propLookup) {
    const propDefs = [];
    for (const key in propLookup) {
        const prop = { ...propLookup[key] };
        prop.name = key;
        propDefs.push(prop);
    }
    const propNames = propDefs.map(propDef => propDef.name);
    const strNames = propDefs.filter(propDef => propDef.type === String).map(propDef => propDef.name);
    const boolNames = propDefs.filter(propDef => propDef.type === Boolean).map(propDef => propDef.name);
    const numNames = propDefs.filter(propDef => propDef.type === Number).map(propDef => propDef.name);
    const parseNames = propDefs.filter(propDef => propDef.parse).map(propDef => propDef.name);
    return { propDefs, propNames, strNames, boolNames, numNames, parseNames, propLookup };
}
