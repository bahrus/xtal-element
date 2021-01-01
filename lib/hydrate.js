import { getSlicedPropDefs } from './getSlicedPropDefs.js';
import { attr } from './attr.js';
import { propUp } from './propUp.js';
export function hydrate(self, propDefs, defaultVals) {
    const slicedDefs = getSlicedPropDefs(propDefs);
    const copyOfDefaultValues = { ...defaultVals };
    attr.mergeStr(self, slicedDefs.numNames, copyOfDefaultValues);
    propUp(self, slicedDefs.propNames, copyOfDefaultValues);
}
