export async function doNotify(self, src, pci, notify) {
    const { toLisp } = self;
    const { prop, key, ov, nv } = pci;
    const { dispatch, echoTo, toggleTo, toggleDelay, echoDelay, reflect, cloneTo, localeStringTo } = notify;
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
        if (echoDelay) {
            let echoDelayNum = typeof (echoDelay) === 'number' ? echoDelay : self[echoDelay];
            setTimeout(() => {
                src[echoTo] = nv;
            }, echoDelayNum);
        }
        else {
            src[echoTo] = nv;
        }
    }
    if (nv !== undefined && cloneTo !== undefined) {
        src[cloneTo] = structuredClone(nv);
    }
    if (toggleTo !== undefined) {
        if (toggleDelay) {
            const toggleDelayNum = typeof (toggleDelay) === 'number' ? toggleDelay : self[toggleDelay];
            setTimeout(() => {
                src[toggleTo] = !nv;
            }, toggleDelayNum);
        }
        else {
            src[toggleTo] = !nv;
        }
    }
    if (localeStringTo !== undefined) {
        const { key, locale, localeOptions } = localeStringTo;
        src[key] = src.toLocale(locale, localeOptions);
    }
    if (reflect !== undefined) {
        if (reflect.asAttr) {
            src.inReflectMode = true;
            let val = pci.nv;
            let remAttr = false;
            switch (pci.prop.type) {
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
                src.removeAttribute(lispName);
            }
            else {
                src.setAttribute(lispName, val);
            }
            src.inReflectMode = false;
        }
    }
    return true;
}
