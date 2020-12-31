import { getPropDefs } from './getPropDefs.js';
export function getSlicedPropDefs(propDefGetters) {
    const propDefs = getPropDefs(propDefGetters);
    const propNames = propDefs.map(propDef => propDef.name);
    const strNames = propDefs.filter(propDef => propDef.type === String).map(propDef => propDef.name);
    const boolNames = propDefs.filter(propDef => propDef.type === Boolean).map(propDef => propDef.name);
    const numNames = propDefs.filter(propDef => propDef.type === Number).map(propDef => propDef.name);
    const parseNames = propDefs.filter(propDef => propDef.parse).map(propDef => propDef.name);
    const propLookup = {};
    for (const propDef of propDefs) {
        propLookup[propDef.name] = propDef;
    }
    return { propDefs, propNames, strNames, boolNames, numNames, parseNames, propLookup };
}
