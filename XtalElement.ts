import {XtallatX, deconstruct, intersection} from './xtal-latx.js';
import {TransformValueOptions} from 'trans-render/types.d.js';
import {hydrate} from 'trans-render/hydrate.js';
// import {init} from 'trans-render/init.js';
// import {update} from 'trans-render/update.js';
import {AttributeProps, EvaluatedAttributeProps, TransformRules, SelectiveUpdate, TransformGetter} from './types.d.js';
import {RenderContext, RenderOptions, Plugins} from 'trans-render/types2.d.js';
import {transform} from 'trans-render/transform.js';
export {AttributeProps} from './types.d.js';
export {define} from './xtal-latx.js';
import {debounce} from './debounce.js';

const deconstructed = Symbol();
const _transformDebouncer = Symbol();
const transformDebouncer = Symbol();
export abstract class XtalElement extends XtallatX(hydrate(HTMLElement)){

    noShadow = false;
    

    _renderOptions = {} as RenderOptions;
    get renderOptions() : RenderOptions{
        return this._renderOptions;
    }

    abstract mainTemplate: HTMLTemplateElement;

    abstract initTransform: TransformRules | TransformGetter<this> ;

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

    __initTransformArgs: Set<string> | undefined;
    async initRenderContext() : Promise<RenderContext>{
        const plugins = await this.plugins();
        const isInitTransformAFunction = typeof this.initTransform === 'function';
        if(isInitTransformAFunction && this.__initTransformArgs === undefined){
            this.__initTransformArgs = new Set<string>(deconstruct(this.initTransform as Function));
        }
        const ctx = {
            Transform: isInitTransformAFunction ? (<any>this).initTransform(this) as TransformRules : this.initTransform as unknown as TransformRules,
            host: this,
            cache: this.constructor,
            mode: 'init',
        } as RenderContext;
        Object.assign(ctx, plugins);
        ctx.ctx = ctx;
        return ctx;
    }
    _renderContext: RenderContext | undefined;
    _mainTemplateProp = 'mainTemplate';

    async plugins() : Promise<Plugins> {
        const {doObjectMatch, repeateth, interpolateSym, plugin} = await import('trans-render/standardPlugins.js');
        return {
            customObjProcessor: doObjectMatch,
            repeatProcessor: repeateth,
            plugins:{
                [interpolateSym]: plugin
            }
        } as Plugins;
    }

    [_transformDebouncer]!: any;
    get [transformDebouncer](){
        if(this[_transformDebouncer] === undefined){
            this[_transformDebouncer] = debounce((getNew: boolean = false) => {
                this.transform();
            }, 16);
        }
        return this[_transformDebouncer];
    }

    async transform(){
        const readyToRender = this.readyToRender;
        let evaluateAllUpdateTransforms = false;
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
        }else{
            if(this.__initTransformArgs && intersection(this._propChangeQueue, this.__initTransformArgs).size > 0){
                //we need to restart the ui initialization, since the initialization depended on some properties that have since changed.
                //reset the UI
                this.root.innerHTML = '';
                delete this._renderContext;
                evaluateAllUpdateTransforms = true;
            }
        }
        let rc = this._renderContext;
        let target: Node;
        let isFirst = true;
        
        if(rc === undefined){
            this.dataset.upgraded = 'true';
            rc = this._renderContext = await this.initRenderContext();
            rc.options = {
                initializedCallback: this.afterInitRenderCallback.bind(this) as (ctx: RenderContext, target: HTMLElement | DocumentFragment, options?: RenderOptions) => RenderContext | void,
            };
            target =  ((<any>this)[this._mainTemplateProp] as HTMLTemplateElement).content.cloneNode(true);
            await transform(
                target as HTMLElement,
                rc
            );
            delete rc.options.initializedCallback;
        }else{
            target = this.root;
            isFirst = false;
        }


        if(this.updateTransforms !== undefined){
            const propChangeQueue = this._propChangeQueue;
            this._propChangeQueue = new Set();
            this.updateTransforms.forEach(async selectiveUpdateTransform =>{
                const dependencies = deconstruct(selectiveUpdateTransform as Function);
                const dependencySet = new Set<string>(dependencies);
                if(evaluateAllUpdateTransforms || intersection(propChangeQueue, dependencySet).size > 0){
                    this._renderOptions.updatedCallback = this.afterUpdateRenderCallback.bind(this);
                    rc!.Transform = selectiveUpdateTransform(this);
                    await transform(target as DocumentFragment, rc!);
                    //rc!.update!(rc!, this.root);
                }
            });
            
        }
        if(isFirst){

            this.root.appendChild(target);
        }
    }

    

    _propChangeQueue: Set<string> = new Set();
    async onPropsChange(name: string, skipTransform = false) {
        super.onPropsChange(name);
        this._propChangeQueue.add(name);

        if(this.disabled || !this._xlConnected || !this.readyToInit){
            return;
        };
        if(!skipTransform){
            await this.transform();
        }
        
    }

}