import { XtallatX, disabled } from 'xtal-latx/xtal-latx.js';
class XtalElement extends XtallatX(HTMLElement) {
    attributeChangedCallback(n, ov, nv) {
        super.attributeChangedCallback(n, ov, nv);
        this.onPropsChange();
    }
    get value() {
        return this._value;
    }
    set value(nv) {
        this._value = nv;
        this.de('value', {
            value: nv
        });
    }
    connectedCallback() {
        this._upgradeProperties([disabled]);
        this._connected = true;
        this.onPropsChange();
    }
    onPropsChange() {
        if (this._disabled || !this._connected || !this.ready)
            return;
        const rc = this.renderContext;
        const esc = this.eventSwitchContext;
        if (this._initialized) {
            this.update(this).then(model => {
                this.value = model;
                if (rc && rc.update) {
                    rc.update(rc, this.shadowRoot);
                }
            });
        }
        else {
            this.init(this).then(model => {
                this.value = model;
                if (this.mainTemplate !== undefined) {
                    this.attachShadow({ mode: 'open' });
                    if (esc) {
                        esc.addEventListeners(this.shadowRoot, esc);
                    }
                    if (rc && rc.init !== undefined) {
                        rc.init(this.mainTemplate, rc, this.shadowRoot);
                    }
                    else {
                        this.shadowRoot.appendChild(this.mainTemplate.content.cloneNode(true));
                    }
                    this._initialized = true;
                }
            });
        }
    }
}
//# sourceMappingURL=xtal-element.js.map