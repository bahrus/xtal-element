import { createTemplate, newRenderContext } from '../utils.js';
import { interpolate } from 'trans-render/interpolate.js';
import { XtalElement } from '../xtal-element.js';
const template = createTemplate(
/* html */ `
    <!-- scoped styles -->
    <style>
    .btn {
		  font-size: 200%;
	  }
    </style>
    <!-- html -->
    <button class="btn">Hello |.name ?? World|</slot></button>`);
const name = 'name';
export class MiniMal extends XtalElement {
    get readyToInit() { return true; }
    get mainTemplate() { return template; }
    get name() {
        return this._name;
    }
    set name(nv) {
        this.attr(name, nv);
    }
    connectedCallback() {
        this.propUp([name]);
        super.connectedCallback();
    }
    static get observedAttributes() {
        return super.observedAttributes.concat([name]);
    }
    attributeChangedCallback(n, ov, nv) {
        switch (n) {
            case name:
                this._name = nv;
                break;
        }
    }
    get initRenderContext() {
        return newRenderContext({
            button: ({ target }) => interpolate(target, 'textContent', this, false),
        });
    }
}
customElements.define('mini-mal', MiniMal);
