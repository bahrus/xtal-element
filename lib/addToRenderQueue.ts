import {TransformConfig, PropDef, SelectiveUpdate, RenderContext} from '../types.d.js';
import {getDestructArgs} from './getDestructArgs.js';
import {intersection} from './intersection.js';

interface Mode {
    doneInitialRender?: boolean;
    initArgs?: Set<string>;
    initRCIP?: boolean;
}
const initialized = new WeakMap<TransformConfig, Mode>();
const queueMap = new WeakMap<TransformConfig, Set<string>>();
const deconstructedUpdateArgs = new WeakMap<SelectiveUpdate, Set<string>>();

export async function addToRenderQueue(config: TransformConfig, prop: PropDef){
    let queue: Set<string> | undefined = undefined;
    if(!queueMap.has(config)){
        queue = new Set<string>();
        queueMap.set(config, queue);
    }else{
        queue = queueMap.get(config)!;
    }
     queue.add(prop.name!);
    await transRender(config);
}

async function initRenderContext() : Promise<RenderContext>{
    const plugins = await this.plugins();
    this.transformHub(this.initTransform);
    const isInitTransformAFunction = typeof this.initTransform === 'function';
    if(isInitTransformAFunction && this.__initTransformArgs === undefined){
        this.__initTransformArgs = new Set<string>(deconstruct(this.initTransform as Function));
    }
    const ctx = {
        Transform: isInitTransformAFunction ? (<any>this).initTransform(this) as TransformValueOptions : this.initTransform as unknown as TransformValueOptions,
        host: this,
        cache: this.constructor,
        mode: 'init',
    } as RenderContext;
    Object.assign(ctx, plugins);
    ctx.ctx = ctx;
    return ctx;
}

async function transRender(config: TransformConfig){
    if(config.notReadyForInitView) return;
    if(!queueMap.has(config)){
        return;
    }
    const queue = queueMap.get(config)!;
    queueMap.set(config, new Set<string>());
    if(!initialized.has(config)){
        if(!config.root){
            if(config.noShadow){
                config.root = config.self;
            }else{
                config.root = config.self.attachShadow({mode: 'open'});
            }
        }
        const mode : Mode = {};
        if(typeof config.initTransform === 'function'){
            mode.initArgs = new Set<string>(getDestructArgs(config.initTransform));
        }
        if(config.updateTransforms !== undefined){
            for(const selectiveUpdate of config.updateTransforms){
                deconstructedUpdateArgs.set(selectiveUpdate, new Set<string>(getDestructArgs(selectiveUpdate)));
            }
        }
        initialized.set(config, {});
    }
    const mode = initialized.get(config)!;
    let evaluateAllUpdateTransforms = false;
    if(config.updateTransforms === undefined){
        //Since there's no delicate update transform,
        //assumption is that if data changes, just redraw based on init
        config.root!.innerHTML = '';
    }else{
        if(mode.initArgs !== undefined && intersection(queue, mode.initArgs).size > 0){
            //we need to restart the ui initialization, since the initialization depended on some properties that have since changed.
            //reset the UI
            config.root!.innerHTML = '';
            delete config.renderContext;
            evaluateAllUpdateTransforms = true;
        }
    }

    let rc = config.renderContext;
    let target: Node;
    let isFirst = true;

    if(rc === undefined){
        //this.dataset.upgraded = 'true';
        mode.initRCIP = true; //TODO:  make sure this is still be used
        rc = config.renderContext = await this.initRenderContext();
        rc.options = {
            initializedCallback: this.afterInitRenderCallback.bind(this) as (ctx: RenderContext, target: HTMLElement | DocumentFragment, options?: RenderOptions) => RenderContext | void,
        };
        target =  ((<any>this)[this._mainTemplateProp] as HTMLTemplateElement).content.cloneNode(true);
        await transform(
            target as HTMLElement,
            rc
        );
        delete rc.options.initializedCallback;
        this.__initRCIP = false;
    }else{
        target = this.root;
        isFirst = false;
    }

}