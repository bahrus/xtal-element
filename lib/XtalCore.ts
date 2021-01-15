import {define} from './define.js';
export {destructPropInfo, PropDef, PropAction, ReactiveSurface} from '../types.js';
import {getPropDefs} from './getPropDefs.js';
import {letThereBeProps} from './letThereBeProps.js';
import {hydrate} from './hydrate.js';
import {Reactor, ReactiveSurface} from './Reactor.js';

export const xc = {
    define, getPropDefs, letThereBeProps, hydrate, Reactor
};