import { XtalElement } from './xtal-element.js';
export class XtalViewElement extends XtalElement {
    constructor() {
        super();
        this.#state = 'constructed';
        this.#controller = new AbortController();
        this.#signal = this.#controller.signal;
    }
    get viewModel() {
        return this._viewModel;
    }
    set viewModel(nv) {
        this._viewModel = nv;
        this.de('view-model', {
            value: nv
        });
        this.transRender();
    }
    #state;
    #controller;
    #signal;
    onPropsChange() {
        if (super._disabled || !this._connected || !this.readyToInit)
            return false;
        switch (this.#state) {
            case 'constructed':
                this.init(this.#signal).then(model => {
                    this.viewModel = model;
                    this.#state = 'initialized';
                });
                this.#state = 'initializing';
            case 'updating':
            case 'initializing':
                //todo: abort
                break;
            case 'updated':
            case 'initialized':
                this.update(this.#signal).then(model => {
                    this.viewModel = model;
                    this.#state = 'updated';
                });
        }
        return true;
    }
}
