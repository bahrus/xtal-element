import { XtalElement } from './XtalElement.js';
export class XtalRoomWithAView extends XtalElement {
    constructor() {
        super();
        this.#state = 'constructed';
        this.#controller = new AbortController();
        this.signal = this.#controller.signal;
    }
    get viewModel() {
        return this._viewModel;
    }
    set viewModel(nv) {
        this._viewModel = nv;
        this.de('view-model', {
            value: nv
        });
        this.onPropsChange('viewModel');
    }
    #state;
    #controller;
    onPropsChange(name) {
        if (super._disabled || !this._connected || !this.readyToInit)
            return false;
        switch (this.#state) {
            case 'constructed':
                this.#state = 'initializing';
                this.initView(this).then(model => {
                    this.#state = 'initialized';
                    this.viewModel = model;
                });
                this.#state = 'initializing';
                return;
            case 'initializing':
                break;
        }
        super.onPropsChange(name);
    }
}
