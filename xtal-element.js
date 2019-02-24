import { XtallatX, disabled } from './xtal-latx.js';
export class XtalElement extends XtallatX(HTMLElement) {
    get noShadow() {
        return false;
    }
    get renderOptions() {
        return {};
    }
    attributeChangedCallback(n, ov, nv) {
        super.attributeChangedCallback(n, ov, nv);
        this.onPropsChange();
    }
    connectedCallback() {
        this._upgradeProperties([disabled]);
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
        const rc = this.renderContext;
        const esc = this.eventContext;
        if (this.mainTemplate !== undefined) {
            if (esc && esc.eventManager !== undefined) {
                if (!this._initialized) {
                    esc.eventManager(this.root, esc);
                }
            }
            if (rc && rc.init !== undefined) {
                if (this._initialized) {
                    rc.update(rc, this.root);
                }
                else {
                    rc.init(this.mainTemplate, rc, this.root, this.renderOptions);
                    //rc.update = this.update;
                }
            }
            else {
                this.root.appendChild(this.mainTemplate.content.cloneNode(true));
            }
            this._initialized = true;
        }
        return true;
    }
}
