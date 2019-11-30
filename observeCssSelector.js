import { getShadowContainer } from './getShadowContainer.js';
export function observeCssSelector(superClass) {
    const eventNames = ["animationstart", "MSAnimationStart", "webkitAnimationStart"];
    return class extends superClass {
        addCSSListener(id, targetSelector, insertListener, customStyles = '') {
            // See https://davidwalsh.name/detect-node-insertion
            if (this._boundInsertListener)
                return;
            const styleInner = /* css */ `
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
            const host = getShadowContainer(this);
            const hostIsShadow = host.localName !== 'html';
            if (hostIsShadow) {
                host.appendChild(style);
            }
            else {
                document.head.appendChild(style);
            }
            this._boundInsertListener = insertListener.bind(this);
            const container = hostIsShadow ? host : document;
            eventNames.forEach(name => {
                container.addEventListener(name, this._boundInsertListener, false);
            });
        }
        disconnectedCallback() {
            if (this._boundInsertListener) {
                const host = getShadowContainer(this);
                const hostIsShadow = host.localName !== 'html';
                const container = hostIsShadow ? host : document;
                eventNames.forEach(name => {
                    container.removeEventListener(name, this._boundInsertListener);
                });
            }
            if (super.disconnectedCallback !== undefined)
                super.disconnectedCallback();
        }
    };
}
