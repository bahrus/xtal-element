import { XtallatX, disabled } from './xtal-latx.js';
import { up } from 'trans-render/hydrate.js';
export class XtalElement extends XtallatX(HTMLElement) {
    get noShadow() {
        return false;
    }
    get renderOptions() {
        return {};
    }
    get updateContext() {
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
        this[up]([disabled]);
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
    onPropsChange() {
        if (this._disabled || !this._connected || !this.ready)
            return false;
        const ic = this.initContext;
        const uc = this.updateContext;
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
                    ic.init(this.mainTemplate, ic, this.root, this.renderOptions);
                }
                else {
                    this.root.appendChild(this.mainTemplate.content.cloneNode(true));
                }
            }
            if (uc !== null) {
                uc.host = this;
                if (uc.update !== undefined) {
                    uc.update(uc, this.root);
                }
            }
            this._initialized = true;
        }
        return true;
    }
}
