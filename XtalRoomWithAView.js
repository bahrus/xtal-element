import { XtalElement } from './XtalElement.js';
import { deconstruct, de } from './xtal-latx.js';
export { XtallatX, camelToLisp, de, intersection, lispToCamel, mergeProps, p, symbolize } from './xtal-latx.js';
export class XtalRoomWithAView extends XtalElement {
    constructor() {
        super();
        this._state = 'constructed';
        this.__controller = new AbortController();
        this.__signal = this.__controller.signal;
    }
    get viewModel() {
        return this._viewModel;
    }
    set viewModel(nv) {
        this._viewModel = nv;
        this[de]('view-model', {
            value: nv
        });
        this.onPropsChange('viewModel');
    }
    async onPropsChange(name, skipTransform = false) {
        await super.onPropsChange(name, this.viewModel === undefined);
        if (super.disabled || !this._xlConnected || !this.readyToInit)
            return;
        switch (this._state) {
            case 'constructed':
                this._state = 'initializing';
                this.initViewModel(this).then(model => {
                    this._state = 'initialized';
                    this.viewModel = model;
                });
                return;
            case 'initializing':
                break;
            case 'initialized':
                if (this.refreshViewModel && deconstruct(this.refreshViewModel).includes(name)) {
                    this._state = 'refreshing';
                    this.refreshViewModel(this).then(model => {
                        this._state = 'refreshed';
                        this.viewModel = model;
                    });
                }
                else if (deconstruct(this.initViewModel).includes(name)) {
                    this._state = 'refreshing';
                    this.initViewModel(this).then(model => {
                        this._state = 'refreshed';
                        this.viewModel = model;
                    });
                }
                break;
        }
    }
}
