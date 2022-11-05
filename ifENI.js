export async function ifENI(instance, propagator, key, oldValue, value, notify, propInfo) {
    const { echoTo, negateTo, incTo } = notify;
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
    if (negateTo !== undefined) {
        if (typeof negateTo === 'string') {
            instance[negateTo] = !value;
        }
        else {
            const { delay, key } = negateTo;
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
                    const { noteIf } = await import('./noteIf.js');
                    await noteIf(instance, propagator, key, oldValue, value, notifyWhenMax, propInfo);
                    return;
                }
            }
        }
        instance[toKey] = nv;
    }
}
