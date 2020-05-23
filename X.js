import { XtalElement } from './XtalElement.js';
export class X extends XtalElement {
    constructor() {
        super(...arguments);
        this.readyToInit = true;
        this.readyToRender = true;
    }
    static tend(args) {
    }
}
