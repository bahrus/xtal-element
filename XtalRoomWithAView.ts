import {XtalElement, deconstruct, intersection} from './XtalElement.js';

export type PromisedInitViewAngle<InitViewModel = any, UpdateViewModel = InitViewModel> 
    = (room: XtalRoomWithAView<InitViewModel, UpdateViewModel>) => Promise<InitViewModel>;
    
export type PromisedUpdateViewAngles<InitViewModel = any, UpdateViewModel = InitViewModel> 
    =  (room: XtalRoomWithAView<InitViewModel, UpdateViewModel>) => Promise<InitViewModel>;

export abstract class XtalRoomWithAView<InitViewModel = any, UpdateViewModel = InitViewModel> extends XtalElement{
    
    abstract initViewModel: PromisedInitViewAngle<InitViewModel, UpdateViewModel>;
    updateViewModel: undefined | PromisedUpdateViewAngles<InitViewModel, UpdateViewModel>[];


    constructor(){
        super();
        this.#state = 'constructed';
        this.#controller = new AbortController();
        this.signal = this.#controller.signal;
    }

    _viewModel!: InitViewModel | UpdateViewModel;
    get viewModel(){
        return this._viewModel;
    }
    set viewModel(nv){
        this._viewModel = nv;
        this.de('view-model', {
            value: nv
        });
        this.onPropsChange('viewModel')
    }

    #state: 'constructed' | 'initializing' | 'initialized' | 'updating' | 'updated' | 'initializingAborted' | 'updatingAborted';
    #controller: AbortController;
    signal: AbortSignal;

    onPropsChange(name: string) {
        if(super._disabled || !this._connected || !this.readyToInit) return false;
        switch(this.#state){
            case 'constructed':
                this.#state = 'initializing';
                this.initViewModel(this).then(model =>{
                    this.#state = 'initialized';
                    this.viewModel = model;
                });
                this.#state = 'initializing';
                return;
            case 'initializing':
                break; 
            case 'initialized':
                this.doViewUpdate();
                break;

            
        }
        super.onPropsChange(name);
    }

    doViewUpdate(){
        //untested
        if(this.updateViewModel !== undefined){
            //TODO: Optimize
            this.updateViewModel.forEach(angle =>{
                const dependencies = deconstruct(angle as Function);
                const dependencySet = new Set<string>(dependencies);
                if(intersection(this._propChangeQueue, dependencySet).size > 0){
                    angle(this).then(model =>{
                        this.#state = 'updated';
                        this.viewModel = model;
                    })
                }
            })
        }
    }
}