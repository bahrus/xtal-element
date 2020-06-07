var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
};
var _controller;
import { XtalElement } from './XtalElement.js';
import { deconstruct, intersection } from './xtal-latx.js';
export { define, mergeProps, de } from './xtal-latx.js';
export class XtalRoomWithAView extends XtalElement {
    constructor() {
        super();
        _controller.set(this, void 0);
        this._state = 'constructed';
        __classPrivateFieldSet(this, _controller, new AbortController());
        this.signal = __classPrivateFieldGet(this, _controller).signal;
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
    onPropsChange(name) {
        super.onPropsChange(name, this.viewModel === undefined);
        if (super.disabled || !this._xlConnected || !this.readyToInit)
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
_controller = new WeakMap();
