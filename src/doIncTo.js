import { doNotify } from 'doNotify.js';
export async function doIncTo(self, src, pci, notify, incTo) {
    if (typeof incTo === 'string') {
        src[incTo] += 1;
        return;
    }
    const { step, key, lt, ltOrEq, loop, min, notifyWhenMax } = incTo;
    const byVal = typeof (step) === undefined ? 1 :
        typeof (step) === 'number' ? step :
            self[step];
    let nv = src[key];
    const hasUBound = lt !== undefined || ltOrEq !== undefined;
    if (hasUBound) {
        const ltUnion = lt || ltOrEq;
        const ubound = typeof (ltUnion) === 'number' ? ltUnion : self[ltUnion];
        if ((lt !== undefined && nv >= ubound) || nv > ubound) {
            //exceeded the max
            if (loop) {
                nv = min;
            }
            else if (notifyWhenMax === undefined) {
                return;
            }
            else {
                doNotify(self, src, pci, notifyWhenMax);
                return;
            }
        }
    }
    src[key] = nv;
}
