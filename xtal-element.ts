import {XtallatX, disabled} from 'xtal-latx/xtal-latx.js';
import {RenderContext} from 'trans-render/init.d.js';
import {EventSwitchContext} from 'event-switch/event-switch.d.js';

abstract class XtalElement<Model> extends XtallatX(HTMLElement){
    _initialized!: boolean;

    get noShadow(){
        return false;
    }

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
        this._upgradeProperties([disabled])
        this._connected = true;
        this.onPropsChange();
    }

    get root() : HTMLElement | DocumentFragment{
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
            this.update(this).then(model =>{
                this.value = model;
                if(rc && rc.update){
                    rc.update(rc, this.root);
                }
            })
        }else{
            this.init(this).then(model =>{
                this.value = model;
                if(this.mainTemplate !== undefined){
                    if(esc){
                        esc.addEventListeners(this.root, esc);
                    }
                    if(rc && rc.init !== undefined){
                        rc.init(this.mainTemplate, rc, this.shadowRoot!)
                    }else{
                        this.root.appendChild(this.mainTemplate.content.cloneNode(true));
                    }
                    this._initialized = true;
                }

            })
        }
    }

}