export class XENON {
    static async define(imp) {
        const config = (await imp()).default;
        config.mixins = config.mixins || [];
        const { XE } = await import('./XE.js');
        const xe = new XE(config);
        return xe.classDef;
    }
}
