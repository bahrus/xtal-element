export async function doReflectTo(self, src, pci, notify, reflectTo, lispName) {
    const { toLisp } = self;
    let reflectToObj = typeof reflectTo === 'string' ? {
        customState: {
            nameValue: reflectTo
        }
    } : reflectTo;
    const { attr: dataAttr, customState } = reflectToObj;
    let val = pci.nv;
    if (dataAttr) {
        src.inReflectMode = true;
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
    if (customState !== undefined) {
        const internals = src.internals_;
        if (internals === undefined)
            return;
        const customStateObj = typeof customState === 'string' ? {
            nameValue: customState,
        } : customState;
        const { nameValue, falsy, truthy } = customStateObj;
        if (nameValue !== undefined) {
            const valAsLisp = toLisp(val.toString());
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
