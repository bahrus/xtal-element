import { XtallatX, deconstruct, intersection } from './xtal-latx.js';
import { hydrate } from 'trans-render/hydrate.js';
import { transform } from 'trans-render/transform.js';
export { define } from './xtal-latx.js';
import { debounce } from './debounce.js';
const deconstructed = Symbol();
const _transformDebouncer = Symbol();
const transformDebouncer = Symbol();
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
        const ctx = {
            Transform: (typeof this.initTransform === 'function') ? this.initTransform(this) : this.initTransform,
            host: this,
            cache: this.constructor,
            mode: 'init',
        };
        ctx.ctx = ctx;
        return ctx;
    }
    get [transformDebouncer]() {
        if (this[_transformDebouncer] === undefined) {
            this[_transformDebouncer] = debounce(async (getNew = false) => {
                await this.transform();
            }, 16);
        }
        return this[_transformDebouncer];
    }
    async transform() {
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
            rc.options = {
                initializedCallback: this.afterInitRenderCallback.bind(this),
            };
            const ret = await transform(this[this._mainTemplateProp], rc, this.root);
            if (!ret)
                throw '?';
        }
        if (this.updateTransforms !== undefined) {
            const propChangeQueue = this._propChangeQueue;
            this._propChangeQueue = new Set();
            this.updateTransforms.forEach(async (selectiveUpdateTransform) => {
                const dependencies = deconstruct(selectiveUpdateTransform);
                const dependencySet = new Set(dependencies);
                if (intersection(propChangeQueue, dependencySet).size > 0) {
                    this._renderOptions.updatedCallback = this.afterUpdateRenderCallback.bind(this);
                    rc.Transform = selectiveUpdateTransform(this);
                    await transform(this.root, rc);
                    //rc!.update!(rc!, this.root);
                }
            });
        }
    }
    async onPropsChange(name, skipTransform = false) {
        super.onPropsChange(name);
        this._propChangeQueue.add(name);
        // if(Array.isArray(name)){
        //     name.forEach(subName => this._propChangeQueue.add(subName));
        // }else{
        //     this._propChangeQueue.add(name);
        // }
        if (this.disabled || !this._xlConnected || !this.readyToInit) {
            return;
        }
        ;
        if (!skipTransform) {
            await this.transform();
        }
    }
}
