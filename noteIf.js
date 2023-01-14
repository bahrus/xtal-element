export async function noteIf(instance, propagator, key, oldValue, value, notify, propInfo) {
    //console.log({instance, propagator, key, oldValue, value, notify, propInfo});
    const { dispatch, echoTo, toggleTo, negateTo, reflectTo, cloneTo, localeStringTo, parseTo, incTo, lengthTo, toFormValue, setTo, toStringTo, mapTo } = notify;
    if (dispatch !== undefined) {
        const { camelToLisp } = await import('trans-render/lib/camelToLisp.js');
        const lispName = camelToLisp(key);
        instance.dispatchEvent(new CustomEvent(lispName + '-changed', {
            detail: {
                oldValue,
                value
            }
        }));
    }
    const isDef = value !== undefined;
    if (isDef && cloneTo !== undefined) {
        instance[cloneTo] = structuredClone(value);
    }
    if (isDef && toStringTo !== undefined) {
        instance[toStringTo] = value.toString();
    }
    if (isDef && localeStringTo !== undefined) {
        const { key, locale, localeOptions } = localeStringTo;
        instance[key] = value.toLocaleString(locale, localeOptions);
    }
    if (lengthTo !== undefined) {
        let nnv = undefined;
        if (value !== undefined) {
            nnv = value.length;
        }
        instance[lengthTo] = nnv;
    }
    if (isDef && toFormValue) {
        let nnv = typeof value === 'object' ? JSON.stringify(value) : value.toString();
        const internals = instance._internals_;
        if (internals !== undefined)
            internals.setFormValue(nnv);
    }
    if (setTo !== undefined) {
        const { key, val } = setTo;
        instance[key] = val;
    }
    if (toggleTo !== undefined) {
        instance[toggleTo] = !instance[toggleTo];
    }
    if (echoTo || negateTo || incTo) {
        const { ifENI } = await import('./ifENI.js');
        await ifENI(instance, propagator, key, oldValue, value, notify, propInfo);
    }
    if (parseTo || reflectTo) {
        const { ifPR } = await import('./ifPR.js');
        await ifPR(instance, propagator, key, oldValue, value, notify, propInfo);
    }
    if (mapTo) {
        const { ifS } = await import('./ifM.js');
        await ifS(instance, propagator, key, oldValue, value, notify, propInfo);
    }
}
