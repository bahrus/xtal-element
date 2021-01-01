import {PropDef} from '../types.d.js';
import {getSlicedPropDefs} from './getSlicedPropDefs.js';
import {attr} from './attr.js';
import {propUp} from './propUp.js';

export function hydrate<T extends Partial<HTMLElement> = HTMLElement>(self: T, propDefs: PropDef[], defaultVals: T){
    const slicedDefs = getSlicedPropDefs(propDefs);
    const copyOfDefaultValues: T = { ...defaultVals };
    attr.mergeStr<T>(self as HTMLElement, slicedDefs.numNames, copyOfDefaultValues);
    propUp(self as HTMLElement, slicedDefs.propNames, copyOfDefaultValues);
}