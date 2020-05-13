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
var _state, _controller;
import { XtalElement, intersection } from './XtalElement.js';
import { deconstruct } from './xtal-latx.js';
export class XtalRoomWithAView extends XtalElement {
    constructor() {
        super();
        _state.set(this, void 0);
        _controller.set(this, void 0);
        __classPrivateFieldSet(this, _state, 'constructed');
        __classPrivateFieldSet(this, _controller, new AbortController());
        this.signal = __classPrivateFieldGet(this, _controller).signal;
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
    onPropsChange(name) {
        if (super._disabled || !this._connected || !this.readyToInit)
            return false;
        switch (__classPrivateFieldGet(this, _state)) {
            case 'constructed':
                __classPrivateFieldSet(this, _state, 'initializing');
                this.initViewModel(this).then(model => {
                    __classPrivateFieldSet(this, _state, 'initialized');
                    this.viewModel = model;
                });
                __classPrivateFieldSet(this, _state, 'initializing');
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
                        __classPrivateFieldSet(this, _state, 'updated');
                        this.viewModel = model;
                    });
                }
            });
        }
    }
}
_state = new WeakMap(), _controller = new WeakMap();
