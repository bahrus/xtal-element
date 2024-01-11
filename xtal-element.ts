import {XE} from './XE.js';
import {
    XtalElementEndUserProps,
    XtalElementActions,
    XtalElementAllProps
} from './types.js';

export class XtalElement extends HTMLElement implements XtalElementActions {
    async define(self: this) {
        const {targetScope} = self;
        console.log({targetScope});
        const {findRealm} = await import('trans-render/lib/findRealm.js');
        const rn = await findRealm(self, targetScope!) as DocumentFragment;
        let blowDry = rn.querySelector('blow-dry');
        if(blowDry === null){
            import('blow-dry/blow-dry.js');
            blowDry = document.createElement('blow-dry');
            blowDry.addEventListener('resolved', e => {
                const canonicalTemplate = (<any>blowDry).canonicalTemplate as HTMLTemplateElement
                console.log({e, canonicalTemplate});
            });
            rn.appendChild(blowDry);
        }
        console.log({rn});
        return {
            resolved: true
        }
    }
}

export interface XtalElement extends XtalElementEndUserProps {

}

const xe = new XE<XtalElementAllProps, XtalElementActions>({
    superclass: XtalElement,
    config: {
        tagName: 'xtal-element',
        propDefaults: {
            isAttrParsed: false,
            targetScope: 'porn',
            inferProps: false,
            propInferenceCriteria: [{
                cssSelector: '[itemprop]',
                attrForProp: 'itemprop',
            }],

        },
        propInfo:{
            shadowRootMode: {
                type: 'String'
            },
            xform: {
                type: 'Object'
            },
            aka: {
                type: 'String'
            },
            mainTemplate: {
                parse: false,
                type: 'Object'
            },
            resolved: {
                notify:{
                    dispatch: true,
                }
            }
        },
        style: {
            display: 'none'
        },
        actions:{
            define: 'isAttrParsed'
        }
    },
})