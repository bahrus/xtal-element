var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
};
var _renderOptions;
import { XtallatX } from './xtal-latx.js';
import { DataDecorators } from './data-decorators.js';
import { hydrate, disabled } from 'trans-render/hydrate.js';
import { init } from 'trans-render/init.js';
import { update } from 'trans-render/update.js';
//export {propUp} from 'trans-render/hydrate.js';
export class XtalElement extends XtallatX(hydrate(DataDecorators(HTMLElement))) {
    constructor() {
        super(...arguments);
        _renderOptions.set(this, {});
        this._mainTemplate = 'mainTemplate';
    }
    get noShadow() {
        return false;
    }
    get renderOptions() {
        return __classPrivateFieldGet(this, _renderOptions);
    }
    get updateTransform() {
        return undefined;
    }
    initRenderCallback(ctx, target) { }
    attributeChangedCallback(n, ov, nv) {
        super.attributeChangedCallback(n, ov, nv);
        this.onPropsChange();
    }
    connectedCallback() {
        this[propUp]([disabled]);
        this._connected = true;
        this.onPropsChange();
    }
    get root() {
        if (this.noShadow)
            return this;
        if (this.shadowRoot == null) {
            this.attachShadow({ mode: 'open' });
        }
        return this.shadowRoot;
    }
    afterInitRenderCallback(ctx, target, renderOptions) { }
    afterUpdateRenderCallback(ctx, target, renderOptions) { }
    initRenderContext() {
        return {
            init: init,
            Transform: this.initTransform,
            host: this,
            cache: this.constructor,
        };
    }
    transRender() {
        var _a;
        const readyToRender = this.readyToRender;
        if (readyToRender === false)
            return;
        if (typeof (readyToRender) === 'string') {
            if (readyToRender !== this._mainTemplate) {
                this.root.innerHTML = '';
                this._renderContext = undefined;
            }
        }
        if (this._renderContext === undefined) {
            this._renderContext = this.initRenderContext();
            __classPrivateFieldGet(this, _renderOptions).initializedCallback = this.afterInitRenderCallback.bind(this);
            this._renderContext.init(this[this._mainTemplate], this._renderContext, this.root, this.renderOptions);
        }
        if (this.updateTransform !== undefined) {
            this._renderContext.update = update;
            this._renderContext.Transform = this.updateTransform;
            __classPrivateFieldGet(this, _renderOptions).updatedCallback = this.afterUpdateRenderCallback.bind(this);
            ((_a = this._renderContext) === null || _a === void 0 ? void 0 : _a.update)(this._renderContext, this.root);
        }
    }
    onPropsChange() {
        if (this._disabled || !this._connected || !this.readyToInit)
            return false;
        this.transRender();
        return true;
    }
}
_renderOptions = new WeakMap();
