import { pc } from 'trans-render/froop/const.js';
export function notarize(instance, propagator, args) {
    propagator.addEventListener(pc, async (e) => {
        const chg = e.detail;
        const { key, oldVal, newVal } = chg;
        const { services } = args;
        const { itemizer } = services;
        await itemizer.resolve();
        const { nonDryProps } = itemizer;
        const propInfo = itemizer.propInfos[key];
        const { notify } = propInfo;
        if (notify === undefined)
            return;
        if (!nonDryProps.has(key)) {
            if (oldVal === newVal)
                return;
        }
        const { noteIf } = await import('./noteIf.js');
        await noteIf(instance, propagator, key, oldVal, newVal, notify, propInfo);
    });
}
