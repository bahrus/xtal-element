import {XtalElement} from './xtal-element.js';

export type PromisedInitViewAngle<InitViewModel = any, UpdateViewModel = InitViewModel> = (room: XtalRoomWithView<InitViewModel, UpdateViewModel>) => Promise<InitViewModel>;
export type PromisedUpdateViewAngles<InitViewModel = any, UpdateViewModel = InitViewModel> =  [(room: XtalRoomWithView<InitViewModel, UpdateViewModel>) => Promise<InitViewModel>];

export abstract class XtalRoomWithView<InitViewModel = any, UpdateViewModel = InitViewModel> extends XtalElement{
    
    abstract initView: PromisedInitViewAngle<InitViewModel, UpdateViewModel>;
    viewUpdates: undefined | PromisedUpdateViewAngles<InitViewModel, UpdateViewModel>;


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
        this.transform();
    }

    #state: 'constructed' | 'initializing' | 'initialized' | 'updating' | 'updated' | 'initializingAborted' | 'updatingAborted';
    #controller: AbortController;
    signal: AbortSignal;

    onPropsChange(): boolean {
        if(super._disabled || !this._connected || !this.readyToInit) return false;
        switch(this.#state){
            case 'constructed':
                this.initView(this).then(model =>{
                    this.viewModel = model;
                    this.#state = 'initialized';
                });
                this.#state = 'initializing';
            //case 'updating':
            case 'initializing':
                //todo: abort
                break; 
            //case 'updated':
            // case 'initialized':
            //     this.update(this.#signal).then(model =>{
            //         this.viewModel = model;
            //         this.#state = 'updated';
            //     })   
        }
        return true;


    }
}