import {O, OConfig} from 'trans-render/froop/O.js';
import {Actions, AP} from './types';

export class XtalElement extends O implements Actions{
    static override config: OConfig<AP, Actions> = {
    }
}