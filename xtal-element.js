import { XtallatX, disabled } from 'xtal-latx/xtal-latx.js';
export class XtalElement extends XtallatX(HTMLElement) {
    get noShadow() {
        return false;
    }
    get renderOptions() {
        return {
            prepend: false,
            matchNext: false,
        };
    }
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
            return;
        const rc = this.renderContext;
        const esc = this.eventSwitchContext;
        if (this._initialized) {
            this.update().then(model => {
                this.value = model;
                if (rc && rc.update) {
                    rc.update(rc, this.root);
                }
            });
        }
        else {
            this.init().then(model => {
                this.value = model;
                if (this.mainTemplate !== undefined) {
                    if (esc && esc.addEventListeners !== undefined) {
                        esc.addEventListeners(this.root, esc);
                    }
                    if (rc && rc.init !== undefined) {
                        rc.init(this.mainTemplate, rc, this.root, this.renderOptions);
                    }
                    else {
                        this.root.appendChild(this.mainTemplate.content.cloneNode(true));
                    }
                    this._initialized = true;
                }
            });
        }
    }
}
//# sourceMappingURL=xtal-element.js.map