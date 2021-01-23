import { attr } from './attr.js';
import { propUp } from './propUp.js';
export function hydrate(self, slicedDefs, defaultVals) {
    const copyOfDefaultValues = defaultVals === undefined ? {} : { ...defaultVals };
    attr.mergeStr(self, slicedDefs.strNames, copyOfDefaultValues);
    attr.mergeNum(self, slicedDefs.numNames, copyOfDefaultValues);
    attr.mergeBool(self, slicedDefs.boolNames, copyOfDefaultValues);
    attr.mergeObj(self, slicedDefs.parseNames, copyOfDefaultValues);
    propUp(self, slicedDefs.propNames, copyOfDefaultValues);
    self.dataset.isHydrated = '';
}
