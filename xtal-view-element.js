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
var _state, _controller, _signal;
import { XtalElement } from './xtal-element.js';
export class XtalViewElement extends XtalElement {
    // abstract async update(signal: AbortSignal) : Promise<ViewModel>;
    constructor() {
        super();
        _state.set(this, void 0);
        _controller.set(this, void 0);
        _signal.set(this, void 0);
        __classPrivateFieldSet(this, _state, 'constructed');
        __classPrivateFieldSet(this, _controller, new AbortController());
        __classPrivateFieldSet(this, _signal, __classPrivateFieldGet(this, _controller).signal);
    }
    get viewModel() {
        return this._viewModel;
    }
    set viewModel(nv) {
        this._viewModel = nv;
        this.de('view-model', {
            value: nv
        });
        this.transform();
    }
    onPropsChange() {
        if (super._disabled || !this._connected || !this.readyToInit)
            return false;
        switch (__classPrivateFieldGet(this, _state)) {
            case 'constructed':
                this.init(__classPrivateFieldGet(this, _signal)).then(model => {
                    this.viewModel = model;
                    __classPrivateFieldSet(this, _state, 'initialized');
                });
                __classPrivateFieldSet(this, _state, 'initializing');
            //case 'updating':
            case 'initializing':
                //todo: abort
                break;
            //case 'updated':
            // case 'initialized':
            //     this.update(this.#signal).then(model =>{
            //         this.viewModel = model;
            //         this.#state = 'updated';
            //     })   
        }
        return true;
    }
}
_state = new WeakMap(), _controller = new WeakMap(), _signal = new WeakMap();
