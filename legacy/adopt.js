import { qsa } from './qsa.js';
export function adopt(dynamicSlotSelector, container, targetElementSelector, postAdopt) {
    qsa(dynamicSlotSelector, container.shadowRoot).forEach(el => {
        el.addEventListener('slotchange', e => {
            const targetEl = container.shadowRoot.querySelector(targetElementSelector);
            if (targetEl === null)
                return;
            e.target.assignedNodes().forEach(node => {
                if (node.nodeType === 3)
                    return;
                const nodeEl = node;
                if (nodeEl.hasAttribute('disabled')) {
                    nodeEl.removeAttribute('disabled');
                    nodeEl['target'] = targetEl;
                }
            });
            if (postAdopt !== null)
                postAdopt(el);
        });
    });
}
