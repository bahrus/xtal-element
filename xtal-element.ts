import {XtallatX, disabled} from './xtal-latx.js';
import {RenderContext, RenderOptions} from 'trans-render/init.d.js';
import {EventContext} from 'event-switch/event-switch.d.js';
import {up} from 'trans-render/hydrate.js';

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


    get eventContext(): EventContext | null{
        return null;
    }


    attributeChangedCallback(n: string, ov: string, nv: string) {
        super.attributeChangedCallback(n, ov, nv);
        this.onPropsChange();
    }


    _connected!: boolean;
    connectedCallback(){
        this[up]([disabled])
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
        const ic = this.initContext;
        const uc = this.updateContext;  
        const esc = this.eventContext;
        if(this.mainTemplate !== undefined){
            if(esc !== null && esc.eventManager !== undefined){
                if(!this._initialized){
                    esc.eventManager(this.root, esc);
                }
                
            }
            if(!this._initialized){
                if(ic !== null && ic.init !== undefined){
                    ic.host = this;
                    ic.init(this.mainTemplate, ic, this.root, this.renderOptions);
                }else{
                    this.root.appendChild(this.mainTemplate.content.cloneNode(true));
                }
            }
            

            if(uc !== null){
                uc.host = this;
                if(uc.update !== undefined){
                    uc.update(uc, this.root);
                }
            }    
            
            this._initialized = true;
        }
        return true;
    }

}