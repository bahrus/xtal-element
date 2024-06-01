import { def } from 'trans-render/lib/def.js';
import { XtalElement } from './xtal-element.js';
await XtalElement.bootUp();
def('xtal-element', XtalElement);
