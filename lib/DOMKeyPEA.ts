import {applyPEA} from 'trans-render/lib/applyPEA.js';
import {DOMKeyPE} from './DOMKeyPE.js';
import {PEAUnionSettings} from 'trans-render/lib/types.d.js';
export {PEAUnionSettings, PEASettings} from 'trans-render/lib/types.d.js';

export class DOMKeyPEA extends DOMKeyPE {
    apply(surface: HTMLElement, el: HTMLElement, ref: any){
        applyPEA(surface, el, ref as PEAUnionSettings);
    }
}