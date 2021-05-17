//https://www.telerik.com/blogs/introduction-mixins-typescript#:~:text=Mixins%20are%20a%20way%20to%20implement%20reusing%20components,two%20classes%20in%20a%20new%20class%20in%20TypeScript.
export function applyMixins(derivedCtor, baseCtors) {
    baseCtors.forEach(baseCtor => {
        Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
            if (name === 'constructor')
                return;
            Object.defineProperty(derivedCtor.prototype, name, Object.getOwnPropertyDescriptor(baseCtor.prototype, name));
        });
    });
}
