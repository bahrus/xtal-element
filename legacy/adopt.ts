import {qsa} from './qsa.js';
export function adopt(dynamicSlotSelector: string, container: HTMLElement, targetElementSelector: string, 
        postAdopt: ((el : HTMLElement) => void) | null){
    qsa(dynamicSlotSelector, container.shadowRoot!).forEach(el =>{
        el.addEventListener('slotchange', e => {
            const targetEl = container.shadowRoot!.querySelector(targetElementSelector);
            if(targetEl === null) return;
            (<HTMLSlotElement>e.target).assignedNodes().forEach(node => {
                if(node.nodeType === 3) return;
                const nodeEl = node as HTMLElement;
                
                if(nodeEl.hasAttribute('disabled')){
                    nodeEl.removeAttribute('disabled');
                    (<any>nodeEl)['target'] = targetEl;
                    
                }
            });
            if(postAdopt !== null) postAdopt(el);
        });
    })
}