import { XtallatX } from './xtal-latx.js';
import { DataDecorators } from './data-decorators.js';
import { hydrate, disabled } from 'trans-render/hydrate.js';
import { init } from 'trans-render/init.js';
import { update } from 'trans-render/update.js';
import { lispToCamel } from './xtal-latx.js';
const deconstructed = Symbol();
export function deconstruct(fn) {
    const fnString = fn.toString().trim();
    if (fnString.startsWith('({')) {
        const iPos = fnString.indexOf('})', 2);
        return fnString.substring(2, iPos).split(',').map(s => s.trim());
    }
    return [];
}
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
export class XtalElement extends XtallatX(hydrate(DataDecorators(HTMLElement))) {
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
    attributeChangedCallback(n, ov, nv) {
        super.attributeChangedCallback(n, ov, nv);
        this.onPropsChange(lispToCamel(n));
    }
    connectedCallback() {
        this.propUp([disabled]);
        this._connected = true;
        this.onPropsChange(disabled);
    }
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
        if (this.selectiveUpdateTransforms === undefined) {
            //Since there's no delicate update transform,
            //assumption is that if data changes, just redraw based on init
            this.root.innerHTML = '';
        }
        if (this._renderContext === undefined) {
            this._renderContext = this.initRenderContext();
            this.#renderOptions.initializedCallback = this.afterInitRenderCallback.bind(this);
            this._renderContext.init(this[this._mainTemplateProp], this._renderContext, this.root, this.renderOptions);
        }
        // if(this.updateTransform !== undefined){
        //     this._renderContext!.update = update;
        //     this._renderContext.Transform = (typeof this.updateTransform === 'function') ? (<any>this).updateTransform() as TransformRules : this.updateTransform;
        //     this.#renderOptions.updatedCallback = this.afterUpdateRenderCallback.bind(this);
        //     this._renderContext?.update!(this._renderContext!, this.root);
        // }
        if (this.selectiveUpdateTransforms !== undefined) {
            //TODO: Optimize
            this._renderContext.update = update;
            this.selectiveUpdateTransforms.forEach(selectiveUpdateTransform => {
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
        //if(this._renderContext){
        this._propChangeQueue.add(name);
        //}
        if (this._disabled || !this._connected || !this.readyToInit) {
            return;
        }
        ;
        this.transform();
    }
}
