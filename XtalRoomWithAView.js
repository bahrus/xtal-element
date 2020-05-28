import { XtalElement, intersection } from './XtalElement.js';
import { deconstruct } from './xtal-latx.js';
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
                this.initViewModel(this).then(model => {
                    this.#state = 'initialized';
                    this.viewModel = model;
                });
                this.#state = 'initializing';
                return;
            case 'initializing':
                break;
            case 'initialized':
                this.doViewUpdate();
                break;
        }
        super.onPropsChange(name);
    }
    doViewUpdate() {
        //untested
        if (this.updateViewModel !== undefined) {
            //TODO: Optimize
            this.updateViewModel.forEach(angle => {
                const dependencies = deconstruct(angle);
                const dependencySet = new Set(dependencies);
                if (intersection(this._propChangeQueue, dependencySet).size > 0) {
                    angle(this).then(model => {
                        this.#state = 'updated';
                        this.viewModel = model;
                    });
                }
            });
        }
    }
}
