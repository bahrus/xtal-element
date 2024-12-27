import {def} from 'trans-render/lib/def.js';
import {XtalElement} from './xtal-element.js';
export {XtalElement} from './xtal-element.js';
export {Mount} from 'trans-render/Mount.js';

await XtalElement.bootUp();
def('xtal-element', XtalElement);