import {XtallatX} from './xtal-latx.js';
import {DataDecorators} from './data-decorators.js';
import {RenderContext, RenderOptions, TransformRules, TransformValueOptions} from 'trans-render/types.d.js';
import {hydrate, disabled} from 'trans-render/hydrate.js';
import {init} from 'trans-render/init.js';
import {update} from 'trans-render/update.js';

type TransformGetter = () => TransformValueOptions;
type SelectiveUpdate = (propName: string) => TransformRules;

export abstract class XtalElement extends XtallatX(hydrate(DataDecorators(HTMLElement))){

    get noShadow(){
        return false;
    }

    #renderOptions = {} as RenderOptions;
    get renderOptions() : RenderOptions{
        return this.#renderOptions;
    }

    abstract mainTemplate(): HTMLTemplateElement;

    abstract initTransform(): TransformRules | TransformGetter ;

    abstract readyToInit: boolean;

    abstract readyToRender: boolean | string | symbol;

    updateTransform: TransformRules | TransformGetter | undefined;

    selectiveUpdateTransforms: TransformRules[] | undefined;

    initRenderCallback(ctx: RenderContext, target: HTMLElement | DocumentFragment){}

    attributeChangedCallback(n: string, ov: string, nv: string) {
        super.attributeChangedCallback(n, ov, nv);
        this.onPropsChange(n);
    }


    _connected!: boolean;
    connectedCallback(){
        this.propUp([disabled]);
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
        if(this.updateTransform === undefined){
            this.root.innerHTML = '';
        }
        if(this._renderContext === undefined){
            this._renderContext = this.initRenderContext();
            this.#renderOptions.initializedCallback = this.afterInitRenderCallback.bind(this);
            this._renderContext.init!((<any>this)[this._mainTemplateProp] as HTMLTemplateElement, this._renderContext, this.root, this.renderOptions);
        }
        if(this.updateTransform !== undefined){
            this._renderContext!.update = update;
            this._renderContext.Transform = (typeof this.updateTransform === 'function') ? (<any>this).updateTransform() as TransformRules : this.updateTransform;
            this.#renderOptions.updatedCallback = this.afterUpdateRenderCallback.bind(this);
            this._renderContext?.update!(this._renderContext!, this.root);
        }
    }
    _propChangeQueue: Set<string> = new Set();
    onPropsChange(name: string) {
        this._propChangeQueue.add(name);
        if(this._disabled || !this._connected || !this.readyToInit){
            return;
        };
        this.transform();
    }

}