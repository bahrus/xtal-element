import { attr } from './attr.js';
import { propUp } from './propUp.js';
export function mergeProps(self, slicedDefs, defaultVals) {
    const copyOfDefaultValues = defaultVals === undefined ? {} : { ...defaultVals };
    for (const prop of slicedDefs.propDefs) {
        if (prop.byoAttrib !== undefined) {
            if (self.hasAttribute(prop.byoAttrib)) {
                delete copyOfDefaultValues[prop.name];
            }
        }
    }
    attr.mergeStr(self, slicedDefs.strNames, copyOfDefaultValues);
    attr.mergeNum(self, slicedDefs.numNames, copyOfDefaultValues);
    attr.mergeBool(self, slicedDefs.boolNames, copyOfDefaultValues);
    attr.mergeObj(self, slicedDefs.parseNames, copyOfDefaultValues);
    propUp(self, slicedDefs.propNames, copyOfDefaultValues);
    if (self._internals !== undefined) {
        //https://wicg.github.io/custom-state-pseudo-class/#:~:text=A%20custom%20state%20pseudo%20class%20contains%20just%20one,like%20x-foo%3Ais%20%28%3A--state1%2C%20%3A--state2%29%2C%20x-foo%3Anot%20%28%3A--state2%29%2C%20and%20x-foo%3A--state1%3A--state2.
        self._internals.states.add('--props-merged');
    }
    else {
        self.dataset.propsMerged = '';
    }
}
