import { lispToCamel } from './lispToCamel.js';
/**
 * xtal-element doesn't think the static observedAttributes adds much value, and only makes life more difficult for web component development.
 * xtal-element's philosophy is that attributes should only be used to 1)  Pass in initial values (from the server), which overrides default values only.
 * 2)  Reflect property changes, but to a different attribute name (switching, eventually, hopefully, to [pseudo state](https://www.chromestatus.com/feature/6537562418053120) )
 */
export function mergeBoolAttr(self, names, defaultValues) {
    for (const name of names) {
        defaultValues[lispToCamel(name)] = self.hasAttribute(name);
    }
}
export function mergeStrAttr(self, names, defaultValues) {
    for (const name of names) {
        if (self.hasAttribute(name))
            defaultValues[lispToCamel(name)] = self.getAttribute(name);
    }
}
export function mergeObjAttr(self, names, defaultValues) {
    for (const name of names) {
        if (self.hasAttribute(name))
            defaultValues[lispToCamel(name)] = JSON.parse(self.getAttribute(name));
    }
}
