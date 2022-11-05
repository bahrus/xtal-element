import {TemplMgmt, TemplMgmtProps, TemplMgmtActions, beTransformed} from 'trans-render/lib/mixins/TemplMgmt.js';
import {PropSettings, DefineArgs} from 'trans-render/lib/types';

export class XENON<Props = any, Actions = Props> {
    static async define<Props = any, Actions = Props>(imp: (() => Promise<{default: DefineArgs<Props, Actions>}>)){
        const config = (await imp()).default;
        config.mixins = config.mixins || [];
        const {XE} = await import('./XE.js');
        const xe = new XE(config);
        return xe.classDef;
    }
}