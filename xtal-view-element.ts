import {XtalElement} from './xtal-element.js';

export abstract class XtalViewElement<ViewModel> extends XtalElement{
    abstract async init() : Promise<ViewModel>;

    abstract async update() : Promise<ViewModel>;

    _viewModel!: ViewModel;
    get viewModel(){
        return this._viewModel;
    }
    set viewModel(nv: ViewModel){
        this._viewModel = nv;
        this.de('view-model', {
            value: nv
        });
    }

    onPropsChange(): boolean{
        if(!super.onPropsChange()) return false;
        //TODO: add abort support
        const rc = this.renderContext;
        const esc = this.eventContext;
        if(this._initialized){
            this.update().then(model =>{
                this.viewModel = model;
                if(rc && rc.update){
                    rc.update(rc, this.root);
                }
            })
        }else{
            this.init().then(model =>{
                this.viewModel = model;
                if(this.mainTemplate !== undefined){
                    if(esc && esc.eventManager !== undefined){
                        esc.eventManager(this.root, esc);
                    }
                    if(rc && rc.init !== undefined){
                        rc.init(this.mainTemplate, rc, this.root, this.renderOptions);
                    }else{
                        this.root.appendChild(this.mainTemplate.content.cloneNode(true));
                    }
                    this._initialized = true;
                }

            })
        }
        return true;
    }
}