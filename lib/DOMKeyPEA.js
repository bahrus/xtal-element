import { applyPEA } from 'trans-render/lib/applyPEA.js';
import { DOMKeyPE } from './DOMKeyPE.js';
export class DOMKeyPEA extends DOMKeyPE {
    apply(surface, el, ref) {
        applyPEA(surface, el, ref);
    }
}
