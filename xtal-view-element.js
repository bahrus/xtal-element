import { XtalElement } from './xtal-element.js';
export class XtalViewElement extends XtalElement {
    constructor() {
        super();
        this.#state = 'constructed';
        this.#controller = new AbortController();
        this.#signal = this.#controller.signal;
    }
    get viewModel() {
        return this._viewModel;
    }
    set viewModel(nv) {
        this._viewModel = nv;
        this.de('view-model', {
            value: nv
        });
        this.transRender();
    }
    #state;
    #controller;
    #signal;
    onPropsChange() {
        if (super._disabled || !this._connected || !this.readyToInit)
            return false;
        switch (this.#state) {
            case 'constructed':
                this.init(this.#signal).then(model => {
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
                this.update(this.#signal).then(model => {
                    this.viewModel = model;
                    this.#state = 'updated';
                });
        }
        return true;
        // if(this._initialized){
        //     this.update().then(model =>{
        //         this.viewModel = model;
        //         const rc = this.initRenderContext;
        //         if(rc && rc.update){
        //             rc.update(rc, this.root);
        //         }
        //     })
        // }else{            
        //     this.init().then(model =>{
        //         this.viewModel = model;
        //         if(this.mainTemplate !== undefined){
        //             const esc = this.eventContext;
        //             if(esc && esc.eventManager !== undefined){
        //                 esc.eventManager(this.root, esc);
        //             }
        //             const rc = this.initRenderContext;
        //             if(rc && rc.init !== undefined){
        //                 const ro = this.renderOptions;
        //                 const b = this.initRenderCallback.bind(this);
        //                 if(!ro.initializedCallback) {
        //                     ro.initializedCallback = b;
        //                 }
        //                 rc.init(this.mainTemplate, rc, this.root, ro);
        //             }else{
        //                 this.root.appendChild(this.mainTemplate.content.cloneNode(true));
        //             }
        //             this._initialized = true;
        //             this.afterInitRenderCallback();
        //         }
        //     })
        // }
    }
}
