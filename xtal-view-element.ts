import {XtalElement} from './xtal-element.js';

export abstract class XtalViewElement<ViewModel> extends XtalElement{
    
    abstract async init(signal: AbortSignal) : Promise<ViewModel>;

    abstract async update(signal: AbortSignal) : Promise<ViewModel>;


    constructor(){
        super();
        this.#state = 'constructed';
        this.#controller = new AbortController();
        this.#signal = this.#controller.signal
    }

    _viewModel!: ViewModel;
    get viewModel(){
        return this._viewModel;
    }
    set viewModel(nv: ViewModel){
        this._viewModel = nv;
        this.de('view-model', {
            value: nv
        });
        this.transRender();
    }

    #state: 'constructed' | 'initializing' | 'initialized' | 'updating' | 'updated' | 'initializingAborted' | 'updatingAborted';
    #controller: AbortController;
    #signal: AbortSignal;

    onPropsChange(): boolean {
        if(super._disabled || !this._connected || !this.readyToInit) return false;
        switch(this.#state){
            case 'constructed':
                this.init(this.#signal).then(model =>{
                    this.viewModel = model;
                    this.#state = 'initialized';
                });
                this.#state = 'initializing';
            case 'updating':
            case 'initializing':
                //todo: abort
                break; 
            case 'updated':
            case 'initialized':
                this.update(this.#signal).then(model =>{
                    this.viewModel = model;
                    this.#state = 'updated';
                })   
        }
        return true;


    }
}