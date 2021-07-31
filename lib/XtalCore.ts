import {define} from './define.js';
export {PropDef, PropAction, ReactiveSurface, PropDefMap, IInternals, IReactor} from '../types.d.js';
import {getSlicedPropDefs} from './getSlicedPropDefs.js';
import {letThereBeProps} from './letThereBeProps.js';
import {mergeProps} from './mergeProps.js';
import {Rx, ReactiveSurface} from './Rx.js';
import {initInternals} from './initInternals.js';
import {passAttrToProp} from './passAttrToProp.js';

export const xc = {
    define, getSlicedPropDefs, letThereBeProps, mergeProps, Rx, initInternals, passAttrToProp
};