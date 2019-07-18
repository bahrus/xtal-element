import { XtallatX } from './xtal-latx.js';
import { DataDecorators } from './data-decorators.js';
import { hydrate, disabled } from 'trans-render/hydrate.js';
export class XtalElement extends XtallatX(hydrate(DataDecorators(HTMLElement))) {
    constructor() {
        super(...arguments);
        this._renderOptions = {};
    }
    get noShadow() {
        return false;
    }
    get renderOptions() {
        return this._renderOptions;
    }
    initRenderCallback(ctx, target) { }
    get updateRenderContext() {
        return null;
    }
    get eventContext() {
        return null;
    }
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
            this.attachShadow({ mode: 'open' });
        }
        return this.shadowRoot;
    }
    afterInitRenderCallback() { }
    onPropsChange() {
        if (this._disabled || !this._connected || !this.readyToInit)
            return false;
        const ic = this.initRenderContext;
        const uc = this.updateRenderContext;
        const esc = this.eventContext;
        if (this.mainTemplate !== undefined) {
            if (esc !== null && esc.eventManager !== undefined) {
                if (!this._initialized) {
                    esc.eventManager(this.root, esc);
                }
            }
            if (!this._initialized) {
                if (ic !== null && ic.init !== undefined) {
                    ic.host = this;
                    //if(!this.renderOptions.initializedCallback) this.renderOptions.initializedCallback = this.initCallback;
                    ic.init(this.mainTemplate, ic, this.root, this.renderOptions);
                }
                else {
                    this.root.appendChild(this.mainTemplate.content.cloneNode(true));
                }
                this._initialized = true;
                this.afterInitRenderCallback();
            }
            if (uc !== null) {
                uc.host = this;
                if (uc.update !== undefined) {
                    uc.update(uc, this.root);
                }
            }
        }
        return true;
    }
}
