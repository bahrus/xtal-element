import {XtallatX, disabled} from 'xtal-latx/xtal-latx.js';
import {RenderContext} from 'trans-render/init.d.js';
import {EventSwitchContext} from 'event-switch/event-switch.d.js';

abstract class XtalElement<Model> extends XtallatX(HTMLElement){
    _initialized!: boolean;

    abstract async init(element: this) : Promise<Model>;

    abstract async update(element: this) : Promise<Model>;

    abstract get mainTemplate(): HTMLTemplateElement;

    abstract get ready(): boolean;

    abstract get renderContext(): RenderContext;

    abstract get eventSwitchContext(): EventSwitchContext;

    attributeChangedCallback(n: string, ov: string, nv: string) {
        super.attributeChangedCallback(n, ov, nv);
        this.onPropsChange();
    }

    _value!: Model;
    get value(){
        return this._value;
    }
    set value(nv: Model){
        this._value = nv;
        this.de('value', {
            value: nv
        });
    }

    _connected!: boolean;
    connectedCallback(){
        this._connected = true;
        this.onPropsChange();
    }

    onPropsChange(){
        if(this._disabled || !this._connected || !this.ready) return;
        if(this._initialized){
            this.update(this).then(model =>{
                this.value = model;

            })
        }else{
            this.init(this).then(model =>{
                this.value = model;
                if(this.renderContext && this.renderContext.init !== undefined){
                    this.attachShadow({mode:'open'});
                    this.renderContext.init(this.mainTemplate, this.renderContext, this.shadowRoot!)
                }
                this._initialized = true;
            })
        }
    }

}