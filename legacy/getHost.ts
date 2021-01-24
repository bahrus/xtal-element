export function getHost(el: HTMLElement) : HTMLElement | null {
    let parent : any = el;
    while (parent = (parent.parentNode)) {
        if (parent.nodeType === 11) {
            return (<any>parent)['host'] as HTMLElement;
        } else if ((<HTMLElement>parent).tagName.indexOf('-') > -1) {
            return parent;
        }  else if (parent.tagName === 'BODY') {
            return null;
        }
    }
    return null;
}