import { XtallatX, deconstruct, intersection } from './xtal-latx.js';
import { hydrate } from 'trans-render/hydrate.js';
export { XtallatX, camelToLisp, de, intersection, define, lispToCamel, mergeProps, p, symbolize } from './xtal-latx.js';
import { transform } from 'trans-render/transform.js';
import { debounce } from './debounce.js';
const deconstructed = Symbol();
const _transformDebouncer = Symbol();
const transformDebouncer = Symbol();
export class XtalElement extends XtallatX(hydrate(HTMLElement)) {
    constructor() {
        super(...arguments);
        /**
         * @private
         */
        this.noShadow = false;
        this._renderOptions = {};
        this._mainTemplateProp = 'mainTemplate';
        this.__initRCIP = false;
        this._propChangeQueue = new Set();
    }
    get renderOptions() {
        return this._renderOptions;
    }
    initRenderCallback(ctx, target) { }
    /**
     * @private
     */
    get root() {
        if (this.noShadow)
            return this;
        if (this.shadowRoot == null) {
            this.attachShadow({ mode: 'open' });
        }
        return this.shadowRoot;
    }
    afterInitRenderCallback(ctx, target, renderOptions) { }
    afterUpdateRenderCallback(ctx, target, renderOptions) { }
    async initRenderContext() {
        const plugins = await this.plugins();
        const isInitTransformAFunction = typeof this.initTransform === 'function';
        if (isInitTransformAFunction && this.__initTransformArgs === undefined) {
            this.__initTransformArgs = new Set(deconstruct(this.initTransform));
        }
        const ctx = {
            Transform: isInitTransformAFunction ? this.initTransform(this) : this.initTransform,
            host: this,
            cache: this.constructor,
            mode: 'init',
        };
        Object.assign(ctx, plugins);
        ctx.ctx = ctx;
        return ctx;
    }
    async plugins() {
        const { doObjectMatch, repeateth, interpolateSym, interpolatePlugin, templStampSym, templStampPlugin } = await import('trans-render/standardPlugins.js');
        return {
            customObjProcessor: doObjectMatch,
            repeatProcessor: repeateth,
            [interpolateSym]: interpolatePlugin,
            [templStampSym]: templStampPlugin
        };
    }
    get [transformDebouncer]() {
        if (this[_transformDebouncer] === undefined) {
            this[_transformDebouncer] = debounce((getNew = false) => {
                this.transform();
            }, 16);
        }
        return this[_transformDebouncer];
    }
    async transform() {
        if (this.__initRCIP)
            return;
        const readyToRender = this.readyToRender;
        let evaluateAllUpdateTransforms = false;
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
        else {
            if (this.__initTransformArgs && intersection(this._propChangeQueue, this.__initTransformArgs).size > 0) {
                //we need to restart the ui initialization, since the initialization depended on some properties that have since changed.
                //reset the UI
                this.root.innerHTML = '';
                delete this._renderContext;
                evaluateAllUpdateTransforms = true;
            }
        }
        let rc = this._renderContext;
        let target;
        let isFirst = true;
        if (rc === undefined) {
            this.dataset.upgraded = 'true';
            this.__initRCIP = true;
            rc = this._renderContext = await this.initRenderContext();
            rc.options = {
                initializedCallback: this.afterInitRenderCallback.bind(this),
            };
            target = this[this._mainTemplateProp].content.cloneNode(true);
            await transform(target, rc);
            delete rc.options.initializedCallback;
            this.__initRCIP = false;
        }
        else {
            target = this.root;
            isFirst = false;
        }
        if (this.updateTransforms !== undefined) {
            const propChangeQueue = this._propChangeQueue;
            this._propChangeQueue = new Set();
            this.updateTransforms.forEach(async (selectiveUpdateTransform) => {
                const dependencies = deconstruct(selectiveUpdateTransform);
                const dependencySet = new Set(dependencies);
                if (evaluateAllUpdateTransforms || intersection(propChangeQueue, dependencySet).size > 0) {
                    this._renderOptions.updatedCallback = this.afterUpdateRenderCallback.bind(this);
                    rc.Transform = selectiveUpdateTransform(this);
                    await transform(target, rc);
                    //rc!.update!(rc!, this.root);
                }
            });
        }
        if (isFirst) {
            this.root.appendChild(target);
        }
    }
    async onPropsChange(name, skipTransform = false) {
        super.onPropsChange(name);
        this._propChangeQueue.add(name);
        if (this.disabled || !this._xlConnected || !this.readyToInit) {
            return;
        }
        ;
        if (!skipTransform) {
            await this.transform();
        }
    }
}
