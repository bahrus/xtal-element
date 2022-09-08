import { CE } from 'trans-render/lib/CE.js';
import { applyP } from 'trans-render/lib/applyP.js';
import { applyPEA } from 'trans-render/lib/applyPEA.js';
export class XE extends CE {
    doPA(self, src, pci, m) {
        const { prop } = pci;
        const { notify } = prop;
        if (notify !== undefined && (m === '+a' || m === '+qr')) {
            (async () => {
                const { doNotify } = await import('./doNotify.js');
                return await doNotify(self, src, pci, notify);
            })();
        }
    }
    async api(args, props) {
        const propsWithNotifications = [];
        for (const key in props) {
            const propInfoExt = props[key];
            if (propInfoExt.notify !== undefined) {
                propsWithNotifications.push([key, propInfoExt]);
            }
        }
        if (propsWithNotifications.length === 0)
            return;
        const { getPropInfos } = await import('./doNotify.js');
        getPropInfos(props, propsWithNotifications);
    }
    async apply(host, target, returnVal, proxy) {
        const dest = proxy !== undefined ? proxy : target;
        if (dest instanceof Element) {
            if (Array.isArray(returnVal)) {
                await applyPEA(host, dest, returnVal);
            }
            else {
                await applyP(dest, [returnVal]);
            }
        }
        else {
            Object.assign(dest, returnVal);
        }
    }
    async postHoc(self, action, host, returnVal, proxy) {
        if (action.target !== undefined) {
            let newTarget = host[action.target];
            if (newTarget === undefined) {
                console.warn('No target found');
                return;
            }
            if (newTarget instanceof NodeList) {
                newTarget = Array.from(newTarget);
            }
            if (Array.isArray(newTarget)) {
                for (const subTarget of newTarget) {
                    let subTargetRef = subTarget;
                    if (subTargetRef.deref) {
                        subTargetRef = subTargetRef.deref();
                    }
                    await self.apply(host, subTargetRef, returnVal, proxy);
                }
            }
            else {
                await self.apply(host, newTarget, returnVal, proxy);
            }
        }
        else {
            await self.apply(host, host, returnVal, proxy);
        }
    }
}
