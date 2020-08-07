import {XtalElement} from './XtalElement.js';
import {deconstruct, intersection, de} from './xtal-latx.js';
export {
    SelectiveUpdate, PropDefGet, TransformGetter, PropAction, AttributeProps, tendArgs, EventScopeT, EventScopeTB, EventScopeTBC, 
    EventScopeTBCCo, EventScope, EventScopes, IXtallatXI, PropInfo, RenderContext, IHydrate, Plugins, Plugin, RenderOptions,
    TransformMatch, NextStep, TransformValueOptions, TransformValueObjectOptions, TransformValueArrayOptions,
    PropSettings, EventSettings, AttribsSettings, PSettings, PESettings, PEASettings, PEAUnionSettings,
    PEATSettings, PEAT$ettings, PEATUnionSettings, ArraySlot, Range, InitTransform, UpdateTransform,
    MetaSettings, TemplateOrTag, TemplateTagGetter, ToTOrFnToTot, AT, ATR, ATRI, ATRIU, ATRIUM, ATRIUM_Loop, EvaluatedAttributeProps
} from './types.d.js';
export {XtallatX, camelToLisp, de, intersection, define, lispToCamel, mergeProps, p, symbolize} from './xtal-latx.js';

export type PromisedInitViewAngle<TBase, InitViewModel = any, RefreshViewModel = InitViewModel> 
    = (room: TBase) => Promise<InitViewModel>;
    
export type PromisedRefreshViewAngles<TBase, InitViewModel = any, RefreshViewModel = InitViewModel> 
    =  (room: TBase) => Promise<RefreshViewModel>;

export abstract class XtalRoomWithAView<InitViewModel = any, RefreshViewModel = InitViewModel> extends XtalElement{
    
    abstract initViewModel: PromisedInitViewAngle<this, InitViewModel, RefreshViewModel>;
    /**
     * @private
     */
    refreshViewModel: undefined | PromisedRefreshViewAngles<this, InitViewModel, RefreshViewModel>;


    constructor(){
        super();
        this._state = 'constructed';
        this.__controller = new AbortController();
        this.__signal = this.__controller.signal;
    }

    _viewModel!: InitViewModel | RefreshViewModel;
    get viewModel(){
        return this._viewModel;
    }
    /**
     * @private
     */
    set viewModel(nv){
        this._viewModel = nv;
        this[de]('view-model', {
            value: nv
        });
        this.onPropsChange('viewModel')
    }

    _state: 'constructed' | 'initializing' | 'initialized' | 'refreshing' | 'refreshed' | 'initializingAborted' | 'refreshingAborted';
    __controller: AbortController;
    __signal: AbortSignal;


    async onPropsChange(name: string,  skipTransform = false) {
        await super.onPropsChange(name, this.viewModel === undefined);
        if(super.disabled || !this._xlConnected || !this.readyToInit) return;
        switch(this._state){
            case 'constructed':
                this._state = 'initializing';
                this.initViewModel(this).then(model =>{
                    this._state = 'initialized';
                    this.viewModel = model;
                });
                return;
            case 'initializing':
                break; 
            case 'initialized':
                if(this.refreshViewModel && deconstruct(this.refreshViewModel).includes(name)){
                    this._state = 'refreshing';
                    this.refreshViewModel(this).then(model =>{
                        this._state = 'refreshed';
                        this.viewModel = model;
                    })
                }else if(deconstruct(this.initViewModel).includes(name)){
                    this._state = 'refreshing';
                    this.initViewModel(this).then(model =>{
                        this._state = 'refreshed';
                        this.viewModel = model;
                    });
                }
                break;
        }
    }



}