import {PropDef} from '../types.d.js';
import {getSlicedPropDefs} from '../lib/getSlicedPropDefs.js';

export function hydrate<T extends Partial<HTMLElement> = HTMLElement>(self: T, propDefs: PropDef[], defaultVals: T){
    const slicedDefs = getSlicedPropDefs(propDefs)
}