import {XtallatX} from './xtal-latx.js';
import {DataDecorators} from './data-decorators.js';
import {RenderContext, RenderOptions, TransformValueOptions} from 'trans-render/types.d.js';
import {hydrate, disabled} from 'trans-render/hydrate.js';
import {init, lispToCamel} from 'trans-render/init.js';
import {update} from 'trans-render/update.js';
import { destruct } from './destruct.js';
import {AttributeProps, EvaluatedAttributeProps, TransformRules, SelectiveUpdate} from './types.d.js';

type TransformGetter = () => TransformValueOptions;

const deconstructed = Symbol();

export function deconstruct(fn: Function){
    const fnString = fn.toString().trim();
    if(fnString.startsWith('({')){
        const iPos = fnString.indexOf('})', 2);
        return fnString.substring(2, iPos).split(',').map(s => s.trim());
    }
    return [];
}

//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set
export function intersection<T = string>(setA: Set<T>, setB: Set<T>) {
    let _intersection = new Set()
    for (let elem of setB) {
        if (setA.has(elem)) {
            _intersection.add(elem)
        }
    }
    return _intersection
}

export abstract class XtalElement extends XtallatX(hydrate(DataDecorators(HTMLElement))){

    get noShadow(){
        return false;
    }

    #renderOptions = {} as RenderOptions;
    get renderOptions() : RenderOptions{
        return this.#renderOptions;
    }

    static __evaluatedProps: EvaluatedAttributeProps;
    static get evaluatedProps(){
        if(this.__evaluatedProps === undefined){
            const args = deconstruct(this.attributeProps);
            const arg: {[key: string]: string} = {};
            args.forEach(token => {
                arg[token] = token;
            });
            this.__evaluatedProps = (<any>this.attributeProps)(arg);
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
    static attributeProps : any = ({disabled} : XtalElement) => ({
        boolean: [disabled],
    } as AttributeProps);

    static get observedAttributes(){
        const props = this.evaluatedProps;
        return [...props.boolean, ...props.numeric, ...props.string, ...props.parsedObject]
    }


    abstract mainTemplate: HTMLTemplateElement;

    abstract initTransform: TransformRules | TransformGetter ;

    abstract readyToInit: boolean;

    abstract readyToRender: boolean | string | symbol;

    //updateTransform: TransformRules | TransformGetter | undefined;

    updateTransforms: SelectiveUpdate[] | undefined;

    initRenderCallback(ctx: RenderContext, target: HTMLElement | DocumentFragment){}

    attributeChangedCallback(n: string, ov: string, nv: string) {
        const propName = lispToCamel(n);
        const anyT = this as any;
        const ep = (<any>this.constructor).evaluatedProps as EvaluatedAttributeProps;
        if(ep.string.includes(propName)){
            anyT[propName] = nv;
        }else if(ep.boolean.includes(propName)){
            anyT[propName] = nv !== null;
        }else if(ep.numeric.includes(propName)){
            anyT[propName] = parseFloat(nv);
        }else if(ep.parsedObject.includes(propName)){
            anyT[propName] = JSON.parse(nv);
        }
        this.onPropsChange(propName);
    }


    _connected!: boolean;
    connectedCallback(){
        const ep = (<any>this.constructor).evaluatedProps as EvaluatedAttributeProps;
        this.propUp([...ep.boolean, ...ep.string, ...ep.numeric, ...ep.object]);
        this._connected = true;
        this.onPropsChange(disabled);
    }

    get root() : HTMLElement | ShadowRoot{
        if(this.noShadow) return this;
        if(this.shadowRoot == null){
            this.attachShadow({mode: 'open', delegatesFocus: true});
        }
        return this.shadowRoot!;
    }

    afterInitRenderCallback(ctx: RenderContext, target: HTMLElement | DocumentFragment, renderOptions: RenderOptions | undefined){}
    afterUpdateRenderCallback(ctx: RenderContext, target: HTMLElement | DocumentFragment, renderOptions: RenderOptions | undefined){}
    initRenderContext() : RenderContext{
        return {
            init: init,
            Transform: (typeof this.initTransform === 'function') ? (<any>this).initTransform() as TransformRules : this.initTransform as unknown as TransformRules,
            host: this,
            cache: this.constructor,
        };
    }
    _renderContext: RenderContext | undefined;
    _mainTemplateProp = 'mainTemplate';
    transform(){
        const readyToRender = this.readyToRender;
        if(readyToRender === false) return;
        if(typeof(readyToRender) === 'string'){
            if(readyToRender !== this._mainTemplateProp){
                this.root.innerHTML = '';
                this._renderContext = undefined;
            }
        }
        if(this.updateTransforms === undefined){
            //Since there's no delicate update transform,
            //assumption is that if data changes, just redraw based on init
            this.root.innerHTML = '';
        }
        if(this._renderContext === undefined){
            this._renderContext = this.initRenderContext();
            this.#renderOptions.initializedCallback = this.afterInitRenderCallback.bind(this);
            this._renderContext.init!((<any>this)[this._mainTemplateProp] as HTMLTemplateElement, this._renderContext, this.root, this.renderOptions);
        }

        if(this.updateTransforms !== undefined){
            //TODO: Optimize
            this._renderContext!.update = update;
            this.updateTransforms.forEach(selectiveUpdateTransform =>{
                const dependencies = deconstruct(selectiveUpdateTransform as Function);
                const dependencySet = new Set<string>(dependencies);
                if(intersection(this._propChangeQueue, dependencySet).size > 0){
                    this.#renderOptions.updatedCallback = this.afterUpdateRenderCallback.bind(this);
                    this._renderContext!.Transform = selectiveUpdateTransform(this);
                    this._renderContext?.update!(this._renderContext!, this.root);
                }
            });
            this._propChangeQueue = new Set();
        }
    }

    _propChangeQueue: Set<string> = new Set();
    onPropsChange(name: string | string[]) {
        if(Array.isArray(name)){
            name.forEach(subName => this._propChangeQueue.add(subName));
        }else{
            this._propChangeQueue.add(name);
        }
        
        if(this._disabled || !this._connected || !this.readyToInit){
            return;
        };
        this.transform();
    }

}