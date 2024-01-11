import { XE } from './XE.js';
export class XtalElement extends HTMLElement {
    async getTemplate(self) {
        const { targetScope } = self;
        console.log({ targetScope });
        const { findRealm } = await import('trans-render/lib/findRealm.js');
        const rn = await findRealm(self, targetScope);
        let blowDry = rn.querySelector('blow-dry');
        let mainTemplate;
        if (blowDry === null) {
            import('blow-dry/blow-dry.js');
            blowDry = document.createElement('blow-dry');
            blowDry.addEventListener('resolved', e => {
                mainTemplate = blowDry.canonicalTemplate;
                const xtalE = mainTemplate.content.querySelector('xtal-element');
                xtalE.remove();
                console.log({ e, mainTemplate });
                self.mainTemplate = mainTemplate;
            });
            rn.appendChild(blowDry);
        }
        console.log({ rn });
        return {
        //mainTemplate
        };
    }
    async define(self) {
        const { mainTemplate, xform, aka, propInfo: pi } = self;
        const { XE } = await import('./XE.js');
        const { TemplMgmt, beTransformed, propInfo } = await import('trans-render/lib/mixins/TemplMgmt.js');
        const { Localizer } = await import('trans-render/lib/mixins/Localizer.js');
        const xe = new XE({
            mixins: [TemplMgmt, Localizer],
            config: {
                tagName: aka,
                actions: {
                    ...beTransformed
                },
                propInfo: {
                    ...propInfo,
                    ...pi,
                },
                propDefaults: {
                    xform,
                    mainTemplate
                }
            }
        });
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
            getTemplate: 'isAttrParsed',
            define: 'mainTemplate',
        }
    },
});
