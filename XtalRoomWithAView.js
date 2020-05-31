import { XtalElement } from './XtalElement.js';
import { deconstruct, intersection } from './xtal-latx.js';
export { define, mergeProps } from './xtal-latx.js';
export class XtalRoomWithAView extends XtalElement {
    constructor() {
        super();
        this._state = 'constructed';
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
    #controller;
    onPropsChange(name) {
        super.onPropsChange(name);
        if (super._disabled || !this._connected || !this.readyToInit)
            return false;
        switch (this._state) {
            case 'constructed':
                this._state = 'initializing';
                this.initViewModel(this).then(model => {
                    this._state = 'initialized';
                    this.viewModel = model;
                });
                this._state = 'initializing';
                return;
            case 'initializing':
                break;
            case 'initialized':
                this.doViewUpdate();
                break;
        }
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
                        this._state = 'updated';
                        this.viewModel = model;
                    });
                }
            });
        }
    }
}
