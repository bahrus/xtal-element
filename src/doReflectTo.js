export async function doReflectTo(self, src, pci, notify, reflectTo, lispName) {
    const { toLisp } = self;
    let reflectToObj = typeof reflectTo === 'string' ? {
        customState: {
            nameValue: reflectTo
        }
    } : reflectTo;
    if (reflectToObj.dataAttr) {
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
