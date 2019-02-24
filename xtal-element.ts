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

    abstract get renderContext(): RenderContext;

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
        return true;
    }

}