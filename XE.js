import { CE } from 'trans-render/froop/CE.js';
export class XE extends CE {
    async addSvcClasses(args) {
        if (args.servers === undefined)
            args.servers = {};
        const config = args.config;
        const { propInfo } = config;
        if (propInfo === undefined)
            return;
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
        await super.addSvcClasses(args);
    }
}
