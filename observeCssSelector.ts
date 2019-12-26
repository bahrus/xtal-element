//import {getShadowContainer} from './getShadowContainer.js';

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
        _host: any;
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
            this._host = this.getRootNode();//experimental  <any>getShadowContainer((<any>this as HTMLElement));
            if(this._host.nodeType === 9){
                this._host = document.firstElementChild;
            }
            const hostIsShadow = this._host.localName !== 'html';
            if(hostIsShadow){
                this._host.appendChild(style);
            }else{
                document.head.appendChild(style);
            }
            this._boundInsertListener = insertListener.bind(this);
            const container = hostIsShadow ? this._host : document;
            eventNames.forEach(name =>{
                container.addEventListener(name, this._boundInsertListener, false);
            })
        }

        disconnectedCallback(){
            if(this._boundInsertListener){
                //const host = <any>getShadowContainer((<any>this as HTMLElement));
                const hostIsShadow = this._host.localName !== 'html';
                const container = hostIsShadow ? this._host : document;
                eventNames.forEach(name =>{
                    container.removeEventListener(name, this._boundInsertListener);
                })
                
            }
            if(super.disconnectedCallback !== undefined) super.disconnectedCallback();
        }
    }
}