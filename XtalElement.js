import { XtallatX, deconstruct } from './xtal-latx.js';
import { hydrate } from 'trans-render/hydrate.js';
import { init } from 'trans-render/init.js';
import { update } from 'trans-render/update.js';
export { define } from './xtal-latx.js';
const deconstructed = Symbol();
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set
export function intersection(setA, setB) {
    let _intersection = new Set();
    for (let elem of setB) {
        if (setA.has(elem)) {
            _intersection.add(elem);
        }
    }
    return _intersection;
}
export class XtalElement extends XtallatX(hydrate(HTMLElement)) {
    constructor() {
        super(...arguments);
        this.#renderOptions = {};
        this._mainTemplateProp = 'mainTemplate';
        this._propChangeQueue = new Set();
    }
    get noShadow() {
        return false;
    }
    #renderOptions;
    get renderOptions() {
        return this.#renderOptions;
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
            Transform: (typeof this.initTransform === 'function') ? this.initTransform() : this.initTransform,
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
        if (this._renderContext === undefined) {
            this._renderContext = this.initRenderContext();
            this.#renderOptions.initializedCallback = this.afterInitRenderCallback.bind(this);
            this._renderContext.init(this[this._mainTemplateProp], this._renderContext, this.root, this.renderOptions);
        }
        if (this.updateTransforms !== undefined) {
            //TODO: Optimize
            this._renderContext.update = update;
            this.updateTransforms.forEach(selectiveUpdateTransform => {
                const dependencies = deconstruct(selectiveUpdateTransform);
                const dependencySet = new Set(dependencies);
                if (intersection(this._propChangeQueue, dependencySet).size > 0) {
                    this.#renderOptions.updatedCallback = this.afterUpdateRenderCallback.bind(this);
                    this._renderContext.Transform = selectiveUpdateTransform(this);
                    this._renderContext?.update(this._renderContext, this.root);
                }
            });
            this._propChangeQueue = new Set();
        }
    }
    onPropsChange(name) {
        if (Array.isArray(name)) {
            name.forEach(subName => this._propChangeQueue.add(subName));
        }
        else {
            this._propChangeQueue.add(name);
        }
        if (this._disabled || !this._connected || !this.readyToInit) {
            return;
        }
        ;
        this.transform();
    }
}
