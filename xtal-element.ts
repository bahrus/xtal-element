import {XtallatX, disabled} from 'xtal-latx/xtal-latx.js';
import {RenderContext, RenderOptions} from 'trans-render/init.d.js';
import {EventSwitchContext} from 'event-switch/event-switch.d.js';

export abstract class XtalElement<ViewModel> extends XtallatX(HTMLElement){
    _initialized!: boolean;

    get noShadow(){
        return false;
    }

    get renderOptions() : RenderOptions{
        return {}
    }

    abstract async init() : Promise<ViewModel>;

    abstract async update() : Promise<ViewModel>;

    abstract get mainTemplate(): HTMLTemplateElement;

    abstract get ready(): boolean;

    abstract get renderContext(): RenderContext;

    abstract get eventSwitchContext(): EventSwitchContext;

    attributeChangedCallback(n: string, ov: string, nv: string) {
        super.attributeChangedCallback(n, ov, nv);
        this.onPropsChange();
    }

    _viewModel!: ViewModel;
    get viewModel(){
        return this._viewModel;
    }
    set viewModel(nv: ViewModel){
        this._viewModel = nv;
        this.de('value', {
            value: nv
        });
    }

    _connected!: boolean;
    connectedCallback(){
        this._upgradeProperties([disabled])
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

    onPropsChange(){
        if(this._disabled || !this._connected || !this.ready) return;
        const rc = this.renderContext;
        const esc = this.eventSwitchContext;
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
    }

}