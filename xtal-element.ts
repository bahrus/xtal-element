import {XtallatX} from './xtal-latx.js';
import {DataDecorators} from './data-decorators.js';
import {RenderContext, RenderOptions, TransformRules, TransformValueOptions} from 'trans-render/init.d.js';
//import {EventContext} from 'event-switch/event-switch.d.js';
import {hydrate, disabled} from 'trans-render/hydrate.js';
import {init} from 'trans-render/init.js';
import {update} from 'trans-render/update.js';

export abstract class XtalElement extends XtallatX(hydrate(DataDecorators(HTMLElement))){
    //_initialized!: boolean;

    get noShadow(){
        return false;
    }

    #renderOptions = {} as RenderOptions;
    get renderOptions() : RenderOptions{
        return this.#renderOptions;
    }

    abstract get mainTemplate(): HTMLTemplateElement;

    abstract get initTransform(): TransformRules;

    abstract get readyToInit(): boolean;

    get updateTransform(): TransformRules | undefined{
        return undefined;
    }

    initRenderCallback(ctx: RenderContext, target: HTMLElement | DocumentFragment){}

    attributeChangedCallback(n: string, ov: string, nv: string) {
        super.attributeChangedCallback(n, ov, nv);
        this.onPropsChange();
    }


    _connected!: boolean;
    connectedCallback(){
        this.propUp([disabled]);
        this._connected = true;
        this.onPropsChange();
    }

    get root() : HTMLElement | ShadowRoot{
        if(this.noShadow) return this;
        if(this.shadowRoot == null){
            this.attachShadow({mode: 'open'});
        }
        return this.shadowRoot!;
    }

    afterInitRenderCallback(){}
    afterUpdateRenderCallback(){}
    initRenderContext() : RenderContext{
        return {
            init: init,
            Transform: this.initTransform,
            host: this,
            cache: this.constructor,
        };
    }
    _renderContext: RenderContext | undefined;
    transRender(){
        if(this._renderContext === undefined){
            this._renderContext = this.initRenderContext();
            this._renderContext.init!(this.mainTemplate, this._renderContext, this.root, this.renderOptions);
            this.afterInitRenderCallback();
        }
        if(this.updateTransform !== undefined){
            this._renderContext!.update = update;
            this._renderContext.Transform = this.updateTransform;
            this._renderContext?.update!(this._renderContext!, this.root);
            this.afterUpdateRenderCallback();
        }
    }
    onPropsChange() : boolean{
        if(this._disabled || !this._connected || !this.readyToInit) return false;
        this.transRender();
        return true;
    }

}