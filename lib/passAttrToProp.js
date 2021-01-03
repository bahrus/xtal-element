import { lispToCamel } from './lispToCamel.js';
function passAttrToProp(self, slicedPropDefs, name, oldValue, newValue) {
    const propDef = slicedPropDefs.propLookup[lispToCamel(name)];
    if (propDef !== undefined) {
    }
}
