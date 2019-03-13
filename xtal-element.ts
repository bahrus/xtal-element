import {XtallatX, disabled} from './xtal-latx.js';
import {RenderContext, RenderOptions} from 'trans-render/init.d.js';
import {EventContext} from 'event-switch/event-switch.d.js';

export abstract class XtalElement extends XtallatX(HTMLElement){
    _initialized!: boolean;

    get noShadow(){
        return false;
    }

    get renderOptions() : RenderOptions{
        return {}
    }

    abstract get mainTemplate(): HTMLTemplateElement;

    abstract get ready(): boolean;

    abstract get initContext(): RenderContext;

    get updateContext(): RenderContext | null{
        return null;
    }

    abstract get eventContext(): EventContext;


    attributeChangedCallback(n: string, ov: string, nv: string) {
        super.attributeChangedCallback(n, ov, nv);
        this.onPropsChange();
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

    onPropsChange() : boolean{
        if(this._disabled || !this._connected || !this.ready) return false;
        const rc = this.initContext;  
        const esc = this.eventContext;
        if(this.mainTemplate !== undefined){
            if(esc && esc.eventManager !== undefined){
                if(!this._initialized){
                    esc.eventManager(this.root, esc);
                }
                
            }
            if(rc && rc.init !== undefined){
                if(this._initialized){
                    if(this.updateContext !== null){
                        this.updateContext.update!(this.updateContext, this.root);
                    }else if(rc.update){
                        rc.update!(rc, this.root);
                    }
                }else{
                    rc.init(this.mainTemplate, rc, this.root, this.renderOptions);
                }
            }else if(!this._initialized){
                this.root.appendChild(this.mainTemplate.content.cloneNode(true));
            }
            this._initialized = true;
        }
        return true;
    }

}