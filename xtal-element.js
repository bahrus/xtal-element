import { XE } from './XE.js';
export class XtalElement extends HTMLElement {
    async define(self) {
        const { targetScope } = self;
        console.log({ targetScope });
        const { findRealm } = await import('trans-render/lib/findRealm.js');
        const rn = await findRealm(self, targetScope);
        let blowDry = rn.querySelector('blow-dry');
        if (blowDry === null) {
            import('blow-dry/blow-dry.js');
            blowDry = document.createElement('blow-dry');
            blowDry.addEventListener('resolved', e => {
                const canonicalTemplate = blowDry.canonicalTemplate;
                console.log({ e, canonicalTemplate });
            });
            rn.appendChild(blowDry);
        }
        console.log({ rn });
        return {
            resolved: true
        };
    }
}
const xe = new XE({
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
        propInfo: {
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
                notify: {
                    dispatch: true,
                }
            }
        },
        style: {
            display: 'none'
        },
        actions: {
            define: 'isAttrParsed'
        }
    },
});
