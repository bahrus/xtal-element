import {define} from './define.js';
export {PropDef, PropAction, ReactiveSurface, PropDefMap} from '../types.d.js';
import {getSlicedPropDefs} from './getSlicedPropDefs.js';
import {letThereBeProps} from './letThereBeProps.js';
import {hydrate} from './hydrate.js';
import {Reactor, ReactiveSurface} from './Reactor.js';

export const xc = {
    define, getSlicedPropDefs, letThereBeProps, hydrate, Reactor
};