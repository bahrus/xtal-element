export async function doNotify(self, src, pci, notify) {
    const { toLisp } = self;
    const { prop, key, ov, nv } = pci;
    const { dispatch, echoTo, negateTo: toggleTo, reflectTo, cloneTo, localeStringTo, parseTo, incTo, lengthTo, toFormValue, setTo } = notify;
    const lispName = toLisp(key);
    if (dispatch) {
        src.dispatchEvent(new CustomEvent(lispName + '-changed', {
            detail: {
                oldValue: ov,
                value: nv,
            }
        }));
    }
    if (echoTo !== undefined) {
        if (typeof echoTo === 'string') {
            src[echoTo] = nv;
        }
        else {
            const { delay, key } = echoTo;
            if (delay) {
                let echoDelayNum = typeof (delay) === 'number' ? delay : self[delay];
                setTimeout(() => {
                    src[key] = nv;
                }, echoDelayNum);
            }
            else {
                src[key] = nv;
            }
        }
    }
    if (incTo !== undefined) {
        const { doIncTo } = await import('./doIncTo.js');
        doIncTo(self, src, pci, notify, incTo);
    }
    if (nv !== undefined && cloneTo !== undefined) {
        src[cloneTo] = structuredClone(nv);
    }
    if (toggleTo !== undefined) {
        if (typeof toggleTo === 'string') {
            src[toggleTo] = !nv;
        }
        else {
            const { delay, key } = toggleTo;
            if (delay) {
                const toggleDelayNum = typeof (delay) === 'number' ? delay : self[delay];
                setTimeout(() => {
                    src[key] = !nv;
                }, toggleDelayNum);
            }
            else {
                src[key] = !nv;
            }
        }
    }
    if (parseTo !== undefined) {
        const { as, key } = parseTo;
        let nnv = nv;
        switch (as) {
            case 'date':
                nnv = new Date(nv);
                break;
            case 'number':
                nnv = Number(nv);
                break;
            case 'obj':
                nnv = JSON.parse(nv);
        }
        src[key] = nnv;
    }
    if (localeStringTo !== undefined) {
        const { key, locale, localeOptions } = localeStringTo;
        src[key] = nv.toLocale(locale, localeOptions);
    }
    if (lengthTo !== undefined) {
        let nnv = undefined;
        if (nv !== undefined) {
            nnv = nv.length;
        }
        src[lengthTo] = nnv;
    }
    if (toFormValue) {
        let nnv = typeof nv === 'object' ? JSON.stringify(nv) : nv.toString();
        src.internals_.setFormValue(nnv);
    }
    if (setTo !== undefined) {
        const { key, val } = setTo;
        src[key] = val;
    }
    if (reflectTo !== undefined) {
        const { doReflectTo } = await import('./doReflectTo.js');
        doReflectTo(self, src, pci, notify, reflectTo, lispName);
    }
    return true;
}
export function getPropInfos(props, propsWithNotifications) {
    for (const keyAndpropInfoExt of propsWithNotifications) {
        const key = keyAndpropInfoExt[0];
        //if(props[key] !== undefined) continue;  shouldn't happen
        const prop = props[key];
        const propInfoExt = keyAndpropInfoExt[1];
        const { notify } = propInfoExt;
        const keys = ['cloneTo', 'echoTo', 'toggleTo', 'localeStringTo'];
        for (const k of keys) {
            makeProp(prop, notify[k], k === 'localeStringTo', props);
        }
    }
}
function makeProp(from, name, makeString = false, props) {
    if (name === undefined)
        return;
    const newProp = {
        type: makeString ? 'String' : from.type,
        parse: false,
    };
    props[name] = newProp;
}
