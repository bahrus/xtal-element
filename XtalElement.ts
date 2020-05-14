import {XtallatX, deconstruct} from './xtal-latx.js';
import {RenderContext, RenderOptions, TransformValueOptions} from 'trans-render/types.d.js';
import {hydrate} from 'trans-render/hydrate.js';
import {init} from 'trans-render/init.js';
import {update} from 'trans-render/update.js';
import {AttributeProps, EvaluatedAttributeProps, TransformRules, SelectiveUpdate} from './types.d.js';
export {define} from './xtal-latx.js';

type TransformGetter = () => TransformValueOptions;

const deconstructed = Symbol();



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

export abstract class XtalElement extends XtallatX(hydrate(HTMLElement)){

    get noShadow(){
        return false;
    }

    #renderOptions = {} as RenderOptions;
    get renderOptions() : RenderOptions{
        return this.#renderOptions;
    }


    abstract mainTemplate: HTMLTemplateElement;

    abstract initTransform: TransformRules | TransformGetter ;

    abstract readyToInit: boolean;

    abstract readyToRender: boolean | string | symbol;

    //updateTransform: TransformRules | TransformGetter | undefined;

    updateTransforms: SelectiveUpdate[] | undefined;

    initRenderCallback(ctx: RenderContext, target: HTMLElement | DocumentFragment){}


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