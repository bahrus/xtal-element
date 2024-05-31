export async function noteIf(instance, propagator, key, oldValue, value, notify, propInfo, config) {
    //console.log({instance, propagator, key, oldValue, value, notify, propInfo});
    const { dispatch, echoTo, toggleTo, negateTo, reflectTo, cloneTo, localeStringTo, parseTo, incTo, lengthTo, toFormValue, setTo, toStringTo, mapTo, wrapTo, } = notify;
    const { isEnh } = config;
    if (dispatch !== undefined) {
        let evtType = key;
        if (!isEnh) {
            const { camelToLisp } = await import('trans-render/lib/camelToLisp.js');
            const lispName = camelToLisp(key);
            evtType = lispName + '-changed';
        }
        instance.dispatchEvent(new CustomEvent(evtType, {
            detail: {
                oldValue,
                value
            }
        }));
    }
    if (isEnh) {
        const { dispatchFromEnhancedElement } = notify;
        if (dispatchFromEnhancedElement) {
            const enhancedElement = instance.enhancedElement;
            const { camelToLisp } = await import('trans-render/lib/camelToLisp.js');
            const lispName = camelToLisp(key);
            const evtType = 'enh-by-' + instance.enhancementInfo.enh + '.' + lispName + '-changed';
            enhancedElement.dispatchEvent(new CustomEvent(evtType, {
                detail: {
                    oldValue,
                    value,
                }
            }));
        }
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
    if (echoTo || negateTo || incTo || toggleTo || setTo) {
        const { ifENI } = await import('./ifENITS.js');
        await ifENI(instance, propagator, key, oldValue, value, notify, propInfo, config);
    }
    if (parseTo || reflectTo) {
        const { ifPR } = await import('./ifPR.js');
        await ifPR(instance, propagator, key, oldValue, value, notify, propInfo);
    }
    if (mapTo || wrapTo) {
        const { ifWM } = await import('./ifWM.js');
        await ifWM(instance, propagator, key, oldValue, value, notify, propInfo);
    }
}
