import { CE } from 'trans-render/froop/CE.js';
export class XE extends CE {
    async addSvcClasses(args) {
        super.addSvcClasses(args);
        const xeArgs = args;
        const { serviceClasses } = xeArgs;
        const { NotifySvc } = await import('./NotifySvc.js');
        serviceClasses.notify = NotifySvc;
    }
    async addSvcs(args) {
        super.addSvcs(args);
        const xeArgs = args;
        const { services, serviceClasses } = xeArgs;
        const { notify } = serviceClasses;
        services.notify = new notify(xeArgs);
    }
}
