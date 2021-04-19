import {define} from './define.js';
export {PropDef, PropAction, ReactiveSurface, PropDefMap, IInternals} from '../types.d.js';
import {getSlicedPropDefs} from './getSlicedPropDefs.js';
import {letThereBeProps} from './letThereBeProps.js';
import {hydrate} from './hydrate.js';
import {Rx, ReactiveSurface} from './Rx.js';
import {initInternals} from './initInternals.js';

export const xc = {
    define, getSlicedPropDefs, letThereBeProps, hydrate, Rx, initInternals
};