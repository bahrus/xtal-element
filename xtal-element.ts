import {XE} from './XE.js';
import {
    XtalElementEndUserProps,
    XtalElementActions
} from './types.js';

export class XtalElement extends HTMLElement implements XtalElementActions {

}

export interface XtalElement extends XtalElementEndUserProps {

}

const xe = new XE<XtalElementEndUserProps, XtalElementActions>({
    superclass: XtalElement,
    config: {
        tagName: 'xtal-element'
    }
})