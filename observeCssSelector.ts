import {getHost} from './getHost.js';

type Constructor<T = {}> = new (...args: any[]) => T;

declare global{
    interface HTMLElement{
        disconnectedCallback() : any;
    }
}


export function observeCssSelector<TBase extends Constructor<HTMLElement>>(superClass: TBase) {

    const eventNames = ["animationstart", "MSAnimationStart", "webkitAnimationStart"];

    return class extends superClass {

        _boundInsertListener!: any;

        addCSSListener(id: string, targetSelector: string, insertListener: any, customStyles: string = ''){
            // See https://davidwalsh.name/detect-node-insertion
            if(this._boundInsertListener) return;
            const styleInner = /* css */`
            @keyframes ${id} {
                from {
                    opacity: 0.99;
                }
                to {
                    opacity: 1;
                }
            }
    
            ${targetSelector}{
                animation-duration: 0.001s;
                animation-name: ${id};
            }
            ${customStyles}`;
            const style = document.createElement('style');
            style.innerHTML = styleInner;
            const host = <any>getHost((<any>this as HTMLElement));
            if(host !== null){
                host.shadowRoot.appendChild(style);
            }else{
                document.head.appendChild(style);
            }
            this._boundInsertListener = insertListener.bind(this);
            const container = host ? host.shadowRoot : document;
            eventNames.forEach(name =>{
                container.addEventListener(name, this._boundInsertListener, false);
            })
            // container.addEventListener("animationstart", this._boundInsertListener, false); // standard + firefox
            // container.addEventListener("MSAnimationStart", this._boundInsertListener, false); // IE
            // container.addEventListener("webkitAnimationStart", this._boundInsertListener, false); // Chrome + Safari
        }

        disconnectedCallback(){
            if(this._boundInsertListener){
                const host = <any>getHost(this);
                const container = host ? host.shadowRoot : document;
                eventNames.forEach(name =>{
                    container.removeEventListener(name, this._boundInsertListener);
                })
                // document.removeEventListener("animationstart", this._boundInsertListener); // standard + firefox
                // document.removeEventListener("MSAnimationStart", this._boundInsertListener); // IE
                // document.removeEventListener("webkitAnimationStart", this._boundInsertListener); // Chrome + Safari
            }
            if(super.disconnectedCallback !== undefined) super.disconnectedCallback();
        }
    }
}