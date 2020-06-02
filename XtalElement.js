import { XtallatX, deconstruct, intersection } from './xtal-latx.js';
import { hydrate } from 'trans-render/hydrate.js';
import { init } from 'trans-render/init.js';
import { update } from 'trans-render/update.js';
export { define } from './xtal-latx.js';
const deconstructed = Symbol();
export class XtalElement extends XtallatX(hydrate(HTMLElement)) {
    constructor() {
        super(...arguments);
        this.noShadow = false;
        this._renderOptions = {};
        this._mainTemplateProp = 'mainTemplate';
        this._propChangeQueue = new Set();
    }
    get renderOptions() {
        return this._renderOptions;
    }
    initRenderCallback(ctx, target) { }
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
            Transform: (typeof this.initTransform === 'function') ? this.initTransform(this) : this.initTransform,
            host: this,
            cache: this.constructor,
        };
    }
    transform() {
        const readyToRender = this.readyToRender;
        if (readyToRender === false)
            return;
        if (typeof (readyToRender) === 'string') {
            if (readyToRender !== this._mainTemplateProp) {
                this.root.innerHTML = '';
                this._renderContext = undefined;
            }
        }
        if (this.updateTransforms === undefined) {
            //Since there's no delicate update transform,
            //assumption is that if data changes, just redraw based on init
            this.root.innerHTML = '';
        }
        let rc = this._renderContext;
        if (rc === undefined) {
            this.dataset.upgraded = 'true';
            rc = this._renderContext = this.initRenderContext();
            this._renderOptions.initializedCallback = this.afterInitRenderCallback.bind(this);
            rc.init(this[this._mainTemplateProp], this._renderContext, this.root, this.renderOptions);
        }
        if (this.updateTransforms !== undefined) {
            //TODO: Optimize
            rc.update = update;
            this.updateTransforms.forEach(selectiveUpdateTransform => {
                const dependencies = deconstruct(selectiveUpdateTransform);
                const dependencySet = new Set(dependencies);
                if (intersection(this._propChangeQueue, dependencySet).size > 0) {
                    this._renderOptions.updatedCallback = this.afterUpdateRenderCallback.bind(this);
                    rc.Transform = selectiveUpdateTransform(this);
                    rc.update(rc, this.root);
                }
            });
            this._propChangeQueue = new Set();
        }
    }
    onPropsChange(name, skipTransform = false) {
        super.onPropsChange(name);
        if (Array.isArray(name)) {
            name.forEach(subName => this._propChangeQueue.add(subName));
        }
        else {
            this._propChangeQueue.add(name);
        }
        if (this.disabled || !this._xlConnected || !this.readyToInit) {
            return;
        }
        ;
        if (!skipTransform) {
            this.transform();
        }
    }
}
