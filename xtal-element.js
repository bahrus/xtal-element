import { XtallatX } from 'xtal-latx/xtal-latx.js';
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
        this._connected = true;
        this.onPropsChange();
    }
    onPropsChange() {
        if (this._disabled || !this._connected || !this.ready)
            return;
        if (this._initialized) {
            this.update(this).then(model => {
                this.value = model;
            });
        }
        else {
            this.init(this).then(model => {
                this.value = model;
                if (this.renderContext && this.renderContext.init !== undefined) {
                    this.attachShadow({ mode: 'open' });
                    this.renderContext.init(this.mainTemplate, this.renderContext, this.shadowRoot);
                }
                this._initialized = true;
            });
        }
    }
}
//# sourceMappingURL=xtal-element.js.map