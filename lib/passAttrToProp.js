import { lispToCamel } from 'trans-render/lib/lispToCamel.js';
export function passAttrToProp(self, slicedPropDefs, name, oldValue, newValue) {
    if (self.dataset.isHydrated === undefined || (self._internals !== undefined && self._internals.states.has('--hydrated')))
        return;
    const camelName = lispToCamel(name);
    const propDef = slicedPropDefs.propLookup[camelName];
    if (propDef !== undefined) {
        let parsedNewVal = newValue;
        switch (propDef.type) {
            case Number:
                parsedNewVal = newValue.includes('.') ? parseFloat(newValue) : parseInt(newValue);
                break;
            case Boolean:
                parsedNewVal = newValue !== null;
                break;
            case Object:
                if (!propDef.parse)
                    return;
                parsedNewVal = JSON.parse(newValue);
                break;
        }
        self[camelName] = parsedNewVal;
    }
}
