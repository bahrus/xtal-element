export async function noteIf(instance, propagator, key, oldValue, value, notify, propInfo) {
    const { dispatch, echoTo, toggleTo, reflectTo, cloneTo, localeStringTo, parseTo, incTo, lengthTo, toFormValue, setTo } = notify;
    if (dispatch) {
        const { camelToLisp } = await import('trans-render/lib/camelToLisp.js');
        const lispName = camelToLisp(key);
        instance.dispatchEvent(new CustomEvent(lispName + '-changed', {
            detail: {
                oldValue,
                value
            }
        }));
    }
    if (echoTo !== undefined) {
        if (typeof echoTo === 'string') {
            instance[echoTo] = value;
        }
        else {
            const { delay, key } = echoTo;
            if (delay) {
                let echoDelayNum = typeof (delay) === 'number' ? delay : self[delay];
                const { eth } = propagator;
                if (eth.has(key)) {
                    clearTimeout(eth.get(key));
                }
                const t = setTimeout(() => {
                    instance[key] = value;
                }, echoDelayNum);
                eth.set(key, t);
            }
            else {
                instance[key] = value;
            }
        }
    }
    if (toggleTo !== undefined) {
        if (typeof toggleTo === 'string') {
            instance[toggleTo] = !value;
        }
        else {
            const { delay, key } = toggleTo;
            if (delay) {
                const toggleDelayNum = typeof (delay) === 'number' ? delay : self[delay];
                const { tth } = propagator;
                if (tth.has(key)) {
                    clearTimeout(tth.get(key));
                }
                const t = setTimeout(() => {
                    instance[key] = !value;
                }, toggleDelayNum);
            }
            else {
                instance[key] = !value;
            }
        }
    }
    if (incTo !== undefined) {
        if (typeof incTo === 'string') {
            instance[incTo] += 1;
            return;
        }
        const { step, key: toKey, lt, ltOrEq, loop, min, notifyWhenMax } = incTo;
        const byVal = typeof (step) === 'undefined' ? 1 :
            typeof (step) === 'number' ? step :
                instance[step];
        let nv = instance[key] + byVal;
        const loopVal = typeof (loop) === 'boolean' ? loop : instance[loop];
        const hasUBound = lt !== undefined || ltOrEq !== undefined;
        if (hasUBound) {
            const ltUnion = lt || ltOrEq;
            const ubound = typeof (ltUnion) === 'number' ? ltUnion : instance[ltUnion];
            if ((lt !== undefined && nv >= ubound) || nv > ubound) {
                //exceeded the max
                if (loopVal) {
                    const minVal = min === undefined ? 0 : typeof (min) === 'number' ? min : instance[min];
                    nv = minVal;
                }
                else if (notifyWhenMax === undefined) {
                    return;
                }
                else {
                    await noteIf(instance, propagator, key, oldValue, value, notifyWhenMax, propInfo);
                    return;
                }
            }
        }
        instance[toKey] = nv;
    }
    if (value !== undefined && cloneTo !== undefined) {
        instance[cloneTo] = structuredClone(value);
    }
    if (parseTo !== undefined) {
        const { as, key } = parseTo;
        let nnv = value;
        switch (as) {
            case 'date':
                nnv = new Date(value);
                break;
            case 'number':
                nnv = Number(value);
                break;
            case 'obj':
                nnv = JSON.parse(value);
        }
        instance[key] = nnv;
    }
    if (localeStringTo !== undefined) {
        const { key, locale, localeOptions } = localeStringTo;
        instance[key] = value.toLocale(locale, localeOptions);
    }
    if (lengthTo !== undefined) {
        let nnv = undefined;
        if (value !== undefined) {
            nnv = value.length;
        }
        instance[lengthTo] = nnv;
    }
    if (toFormValue) {
        let nnv = typeof value === 'object' ? JSON.stringify(value) : value.toString();
        instance.internals_.setFormValue(nnv);
    }
    if (setTo !== undefined) {
        const { key, val } = setTo;
        instance[key] = val;
    }
    if (reflectTo !== undefined) {
        const { camelToLisp } = await import('trans-render/lib/camelToLisp.js');
        const lispName = camelToLisp(key);
        let reflectToObj = typeof reflectTo === 'string' ? {
            customState: {
                nameValue: reflectTo
            }
        } : reflectTo;
        const { attr, customState } = reflectToObj;
        let val = value;
        if (attr) {
            //(<any>in).inReflectMode = true;
            let remAttr = false;
            switch (propInfo.type) {
                case 'Number':
                    val = val.toString();
                    break;
                case 'Boolean':
                    if (val) {
                        val = '';
                    }
                    else {
                        remAttr = true;
                    }
                    break;
                case 'Object':
                    val = JSON.stringify(val);
                    break;
            }
            if (remAttr) {
                instance.removeAttribute(lispName);
            }
            else {
                instance.setAttribute(lispName, val);
            }
            //(<any>src).inReflectMode = false;
        }
        if (customState !== undefined) {
            const internals = instance.internals_;
            if (internals === undefined)
                return;
            const customStateObj = typeof customState === 'string' ? {
                nameValue: customState,
            } : customState;
            const { nameValue, falsy, truthy } = customStateObj;
            if (nameValue !== undefined) {
                const valAsLisp = camelToLisp(val.toString());
                internals.states.add(`--${lispName}-${valAsLisp}`);
            }
            if (truthy) {
                const verb = val ? 'add' : 'remove';
                internals.states[verb](`--${truthy}`);
            }
            if (falsy) {
                const verb = val ? 'remove' : 'add';
                internals.states[verb](`--${falsy}`);
            }
        }
    }
}
