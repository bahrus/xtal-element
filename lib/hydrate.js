import { getSlicedPropDefs } from './getSlicedPropDefs.js';
import { attr } from './attr.js';
import { propUp } from './propUp.js';
export function hydrate(self, propDefs, defaultVals) {
    const slicedDefs = getSlicedPropDefs(propDefs);
    const copyOfDefaultValues = { ...defaultVals };
    attr.mergeStr(self, slicedDefs.strNames, copyOfDefaultValues);
    attr.mergeNum(self, slicedDefs.numNames, copyOfDefaultValues);
    attr.mergeBool(self, slicedDefs.boolNames, copyOfDefaultValues);
    attr.mergeObj(self, slicedDefs.parseNames, copyOfDefaultValues);
    propUp(self, slicedDefs.propNames, copyOfDefaultValues);
}
