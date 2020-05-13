var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
};
var _renderOptions;
import { XtallatX } from './xtal-latx.js';
import { DataDecorators } from './data-decorators.js';
import { hydrate, disabled } from 'trans-render/hydrate.js';
import { init, lispToCamel } from 'trans-render/init.js';
import { update } from 'trans-render/update.js';
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
        _renderOptions.set(this, {});
        this._mainTemplateProp = 'mainTemplate';
        this._propChangeQueue = new Set();
    }
    get noShadow() {
        return false;
    }
    get renderOptions() {
        return __classPrivateFieldGet(this, _renderOptions);
    }
    static get evaluatedProps() {
        if (this.__evaluatedProps === undefined) {
            const args = deconstruct(this.attributeProps);
            const arg = {};
            args.forEach(token => {
                arg[token] = token;
            });
            this.__evaluatedProps = this.attributeProps(arg);
            const ep = this.__evaluatedProps;
            ep.boolean = ep.boolean || [];
            ep.numeric = ep.numeric || [];
            ep.parsedObject = ep.parsedObject || [];
            ep.noReflect = ep.noReflect || [];
            ep.notify = ep.notify || [];
            ep.object = ep.object || [];
            ep.string = ep.string || [];
        }
        return this.__evaluatedProps;
    }
    static get observedAttributes() {
        const props = this.evaluatedProps;
        return [...props.boolean, ...props.numeric, ...props.string, ...props.parsedObject];
    }
    initRenderCallback(ctx, target) { }
    attributeChangedCallback(n, ov, nv) {
        const propName = lispToCamel(n);
        const anyT = this;
        const ep = this.constructor.evaluatedProps;
        if (ep.string.includes(propName)) {
            anyT[propName] = nv;
        }
        else if (ep.boolean.includes(propName)) {
            anyT[propName] = nv !== null;
        }
        else if (ep.numeric.includes(propName)) {
            anyT[propName] = parseFloat(nv);
        }
        else if (ep.parsedObject.includes(propName)) {
            anyT[propName] = JSON.parse(nv);
        }
        this.onPropsChange(propName);
    }
    connectedCallback() {
        const ep = this.constructor.evaluatedProps;
        this.propUp([...ep.boolean, ...ep.string, ...ep.numeric, ...ep.object]);
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
        if (this.updateTransforms === undefined) {
            //Since there's no delicate update transform,
            //assumption is that if data changes, just redraw based on init
            this.root.innerHTML = '';
        }
        if (this._renderContext === undefined) {
            this._renderContext = this.initRenderContext();
            __classPrivateFieldGet(this, _renderOptions).initializedCallback = this.afterInitRenderCallback.bind(this);
            this._renderContext.init(this[this._mainTemplateProp], this._renderContext, this.root, this.renderOptions);
        }
        if (this.updateTransforms !== undefined) {
            //TODO: Optimize
            this._renderContext.update = update;
            this.updateTransforms.forEach(selectiveUpdateTransform => {
                var _a;
                const dependencies = deconstruct(selectiveUpdateTransform);
                const dependencySet = new Set(dependencies);
                if (intersection(this._propChangeQueue, dependencySet).size > 0) {
                    __classPrivateFieldGet(this, _renderOptions).updatedCallback = this.afterUpdateRenderCallback.bind(this);
                    this._renderContext.Transform = selectiveUpdateTransform(this);
                    ((_a = this._renderContext) === null || _a === void 0 ? void 0 : _a.update)(this._renderContext, this.root);
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
_renderOptions = new WeakMap();
XtalElement.attributeProps = ({ disabled }) => ({
    boolean: [disabled]
});
