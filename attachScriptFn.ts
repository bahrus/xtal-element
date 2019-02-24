export function attachScriptFn(tagName: string, target: any, prop: string, body: string, imports:string){
    const constructor = customElements.get(tagName);
    const count = constructor._count++;
    const script = document.createElement('script');
    
    if(supportsStaticImport()) {
        script.type = 'module';
    }
    script.innerHTML = `
${imports}
(function () {
${body}
const constructor = customElements.get('${tagName}');
constructor['fn_' + ${count}] = __fn;
})();
`;
    document.head!.appendChild(script);
    attachFn(constructor, count, target, prop);
}

function supportsStaticImport() {
    const script = document.createElement('script');
    return 'noModule' in script; 
  }

function attachFn(constructor: any, count: number, target: any, prop: string){
    const Fn = constructor['fn_' + count];
    if(Fn === undefined){
        setTimeout(() => {
            attachFn(constructor, count, target, prop);
        }, 10);
        return;
    }
    target[prop] = Fn;
}
export function getDynScript(el: HTMLElement, callBack: any){
    (<any>el)._script = el.querySelector('script') as HTMLScriptElement;
    if(!(<any>el)._script){
        setTimeout(() => {
            getDynScript(el, callBack)
        }, 10);
        return;
    }
    callBack();
} 