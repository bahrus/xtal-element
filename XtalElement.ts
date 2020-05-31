import {XtallatX, deconstruct, intersection} from './xtal-latx.js';
import {RenderContext, RenderOptions, TransformValueOptions} from 'trans-render/types.d.js';
import {hydrate} from 'trans-render/hydrate.js';
import {init} from 'trans-render/init.js';
import {update} from 'trans-render/update.js';
import {AttributeProps, EvaluatedAttributeProps, TransformRules, SelectiveUpdate, TransformGetter} from './types.d.js';
export {AttributeProps} from './types.d.js';
export {define} from './xtal-latx.js';

const deconstructed = Symbol();

export abstract class XtalElement extends XtallatX(hydrate(HTMLElement)){

    noShadow = false;

    _renderOptions = {} as RenderOptions;
    get renderOptions() : RenderOptions{
        return this._renderOptions;
    }

    abstract mainTemplate: HTMLTemplateElement;

    abstract initTransform: TransformRules | TransformGetter ;

    abstract readyToInit: boolean;

    abstract readyToRender: boolean | string | symbol;

    //updateTransform: TransformRules | TransformGetter | undefined;

    updateTransforms: SelectiveUpdate<this>[] | undefined;

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
            Transform: (typeof this.initTransform === 'function') ? (<any>this).initTransform(this) as TransformRules : this.initTransform as unknown as TransformRules,
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
        let rc = this._renderContext;
        if(rc === undefined){
            this.dataset.upgraded = 'true';
            rc = this._renderContext = this.initRenderContext();
            this._renderOptions.initializedCallback = this.afterInitRenderCallback.bind(this);
            rc.init!((<any>this)[this._mainTemplateProp] as HTMLTemplateElement, this._renderContext, this.root, this.renderOptions);
        }

        if(this.updateTransforms !== undefined){
            //TODO: Optimize
            rc!.update = update;
            this.updateTransforms.forEach(selectiveUpdateTransform =>{
                const dependencies = deconstruct(selectiveUpdateTransform as Function);
                const dependencySet = new Set<string>(dependencies);
                if(intersection(this._propChangeQueue, dependencySet).size > 0){
                    this._renderOptions.updatedCallback = this.afterUpdateRenderCallback.bind(this);
                    rc!.Transform = selectiveUpdateTransform(this);
                    rc!.update!(rc!, this.root);
                }
            });
            this._propChangeQueue = new Set();
        }
    }

    _propChangeQueue: Set<string> = new Set();
    onPropsChange(name: string | string[]) {
        super.onPropsChange(name)
        if(Array.isArray(name)){
            name.forEach(subName => this._propChangeQueue.add(subName));
        }else{
            this._propChangeQueue.add(name);
        }
        
        if(this.disabled || !this.isConnected || !this.readyToInit){
            return;
        };
        this.transform();
    }

}