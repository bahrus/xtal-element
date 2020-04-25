import { XtallatX } from './xtal-latx.js';
import { DataDecorators } from './data-decorators.js';
//import {EventContext} from 'event-switch/event-switch.d.js';
import { hydrate, disabled } from 'trans-render/hydrate.js';
import { init } from 'trans-render/init.js';
import { update } from 'trans-render/update.js';
export class XtalElement extends XtallatX(hydrate(DataDecorators(HTMLElement))) {
    constructor() {
        //_initialized!: boolean;
        super(...arguments);
        this.#renderOptions = {};
    }
    get noShadow() {
        return false;
    }
    #renderOptions;
    get renderOptions() {
        return this.#renderOptions;
    }
    get updateTransform() {
        return undefined;
    }
    initRenderCallback(ctx, target) { }
    attributeChangedCallback(n, ov, nv) {
        super.attributeChangedCallback(n, ov, nv);
        this.onPropsChange();
    }
    #connected;
    connectedCallback() {
        this.propUp([disabled]);
        this.#connected = true;
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
    initRenderContext() {
        return {
            init: init,
            Transform: this.initTransform,
            host: this,
            cache: this.constructor
        };
    }
    #renderContext;
    onPropsChange() {
        if (this._disabled || !this.#connected || !this.readyToInit)
            return false;
        //const uc = this.updateRenderContext;  
        if (this.mainTemplate !== undefined) {
            if (this.#renderContext === undefined) {
                this.#renderContext = this.initRenderContext();
                this.#renderContext.init(this.mainTemplate, this.#renderContext, this.root, this.renderOptions);
                this.afterInitRenderCallback();
            }
            if (this.updateTransform !== undefined) {
                this.#renderContext.update = update;
                this.#renderContext.Transform = this.updateTransform;
                this.#renderContext?.update(this.#renderContext, this.root);
            }
        }
        return true;
    }
}
