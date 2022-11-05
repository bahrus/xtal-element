import { CE } from 'trans-render/froop/CE.js';
export class XE extends CE {
    async addSvcClasses(args) {
        await super.addSvcClasses(args);
        const config = args.config;
        const { propInfo } = config;
        if (propInfo === undefined)
            return;
        let foundNotify = false;
        for (const prop in propInfo) {
            const propInfoExt = propInfo[prop];
            if (propInfoExt.notify !== undefined) {
                const xeArgs = args;
                const { servers } = xeArgs;
                const { NotifySvc } = await import('./NotifySvc.js');
                servers.notify = NotifySvc;
                break;
            }
        }
    }
}
