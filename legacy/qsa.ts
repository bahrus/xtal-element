export function qsa(css: string, from: HTMLElement | Document | DocumentFragment): HTMLElement[] {
    return [].slice.call(from.querySelectorAll(css)); 
}