//D'Oh  https://developer.mozilla.org/en-US/docs/Web/API/Node/getRootNode
export function getShadowContainerDeprecated(el: HTMLElement) : DocumentFragment | HTMLElement | null {
    let parent : any = el;
    while (parent = (parent.parentNode)) {
        if (parent.nodeType === 11) {
            return parent;
        }  else if (parent.tagName === 'HTML') {
            return parent;
        }
    }
    return null;
}