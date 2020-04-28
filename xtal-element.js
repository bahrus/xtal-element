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
export class XtalElement extends XtallatX(hydrate(DataDecorators(HTMLElement))) {
    constructor() {
        super(...arguments);
        _renderOptions.set(this, {});
        this._mainTemplateProp = 'mainTemplate';
    }
    get noShadow() {
        return false;
    }
    get renderOptions() {
        return __classPrivateFieldGet(this, _renderOptions);
    }
    initRenderCallback(ctx, target) { }
    attributeChangedCallback(n, ov, nv) {
        super.attributeChangedCallback(n, ov, nv);
        this.onPropsChange();
    }
    connectedCallback() {
        this.propUp([disabled]);
        this._connected = true;
        this.onPropsChange();
    }
    get root() {
        if (this.noShadow)
            return this;
        if (this.shadowRoot == null) {
            this.attachShadow({ mode: 'open', delegatesFocus: true });
        }
        return this.shadowRoot;
    }
    afterInitRenderCallback(ctx, target, renderOptions) { }
    afterUpdateRenderCallback(ctx, target, renderOptions) { }
    initRenderContext() {
        return {
            init: init,
            Transform: (typeof this.initTransform === 'function') ? this.initTransform() : this.initTransform,
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
            if (readyToRender !== this._mainTemplateProp) {
                this.root.innerHTML = '';
                this._renderContext = undefined;
            }
        }
        if (this.updateTransform === undefined) {
            this.root.innerHTML = '';
        }
        if (this._renderContext === undefined) {
            this._renderContext = this.initRenderContext();
            __classPrivateFieldGet(this, _renderOptions).initializedCallback = this.afterInitRenderCallback.bind(this);
            this._renderContext.init(this[this._mainTemplateProp], this._renderContext, this.root, this.renderOptions);
        }
        if (this.updateTransform !== undefined) {
            this._renderContext.update = update;
            this._renderContext.Transform = (typeof this.updateTransform === 'function') ? this.updateTransform() : this.updateTransform;
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
