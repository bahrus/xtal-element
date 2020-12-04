export function attachScriptFn(tagName, target, prop, body, imports) {
    const constructor = customElements.get(tagName);
    const count = constructor._count++;
    const script = document.createElement('script');
    if (supportsStaticImport()) {
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
    document.head.appendChild(script);
    attachFn(constructor, count, target, prop);
}
function supportsStaticImport() {
    const script = document.createElement('script');
    return 'noModule' in script;
}
function attachFn(constructor, count, target, prop) {
    const Fn = constructor['fn_' + count];
    if (Fn === undefined) {
        setTimeout(() => {
            attachFn(constructor, count, target, prop);
        }, 10);
        return;
    }
    if (typeof prop === 'function') {
        prop(Fn);
    }
    else {
        target[prop] = Fn;
    }
}
export function getDynScript(el, callBack) {
    el._script = el.querySelector('script');
    if (!el._script) {
        setTimeout(() => {
            getDynScript(el, callBack);
        }, 10);
        return;
    }
    callBack();
}
