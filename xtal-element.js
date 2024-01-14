import { XE } from './XE.js';
export class XtalElement extends HTMLElement {
    async getTemplate(self) {
        const { targetScope, aka } = self;
        const { findRealm } = await import('trans-render/lib/findRealm.js');
        const rn = await findRealm(self, targetScope);
        if (aka === undefined) {
            if (rn instanceof Element) {
                self.aka = rn.localName;
                rn.skipTemplateClone = true;
            }
            else if (rn.host !== undefined) {
                const host = rn.host;
                self.shadowRootMode = 'open'; //how do we detect closed?
                self.aka = host.localName;
                host.skipTemplateClone = true;
            }
            else {
                throw 404;
            }
        }
        let blowDry = rn.querySelector('blow-dry');
        let mainTemplate;
        if (blowDry === null) {
            import('blow-dry/blow-dry.js');
            blowDry = document.createElement('blow-dry');
            blowDry.addEventListener('resolved', e => {
                mainTemplate = blowDry.canonicalTemplate;
                const xtalE = mainTemplate.content.querySelector('xtal-element');
                xtalE.remove();
                const adopted = Array.from(mainTemplate.content.querySelectorAll('style[adopt]'));
                const styles = adopted.map(s => {
                    const inner = s.innerHTML;
                    s.remove();
                    return inner;
                }).join('');
                self.styles = styles;
                self.mainTemplate = mainTemplate;
            });
            rn.appendChild(blowDry);
        }
        return {
        //mainTemplate
        };
    }
    async define(self) {
        const { mainTemplate, xform, aka, propInfo: pi, inferProps, propDefaults, shadowRootMode, beFormAssociated, styles, superclass, actions } = self;
        const { XE } = await import('./XE.js');
        const { TemplMgmt, beTransformed, propInfo } = await import('trans-render/lib/mixins/TemplMgmt.js');
        const { Localizer } = await import('trans-render/lib/mixins/Localizer.js');
        const inferredProps = {};
        const inferredXForm = {};
        const inferredDefaultValues = {};
        let superClassCtr;
        if (superclass !== undefined) {
            superClassCtr = await customElements.whenDefined(superclass);
            console.log({ superClassCtr });
        }
        if (inferProps) {
            const { propInferenceCriteria } = self;
            const content = mainTemplate.content;
            for (const criteria of propInferenceCriteria) {
                const { cssSelector, attrForProp } = criteria;
                const matches = Array.from(content.querySelectorAll(cssSelector));
                for (const match of matches) {
                    const propName = match.getAttribute(attrForProp);
                    const { localName } = match;
                    let prop;
                    if (match instanceof HTMLLinkElement) {
                        const { href } = match;
                        prop = {
                            type: 'Boolean',
                        };
                        inferredDefaultValues[propName] = !href ? undefined : href.endsWith('True') ? true : false;
                        match.href = '';
                    }
                    else {
                        prop = {
                            type: 'String'
                        };
                    }
                    inferredProps[propName] = prop;
                    inferredXForm[`| ${propName}`] = 0;
                }
            }
        }
        const xe = new XE({
            mixins: [TemplMgmt, Localizer],
            config: {
                tagName: aka,
                actions: {
                    ...beTransformed,
                    ...actions,
                },
                propInfo: {
                    ...inferredProps,
                    ...propInfo,
                    ...pi,
                },
                propDefaults: {
                    ...propDefaults,
                    ...inferredDefaultValues,
                    shadowRootMode,
                    xform: { ...inferredXForm, ...xform },
                    mainTemplate,
                    styles,
                },
                formAss: beFormAssociated,
            },
            superclass: superClassCtr,
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
            isPropDefaulted: true,
        },
        propInfo: {
            actions: {
                type: 'Object'
            },
            beFormAssociated: {
                type: 'Boolean'
            },
            shadowRootMode: {
                type: 'String'
            },
            xform: {
                type: 'Object'
            },
            propDefaults: {
                type: 'Object'
            },
            propInfo: {
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
            },
            superclass: {
                type: 'String'
            }
        },
        style: {
            display: 'none'
        },
        actions: {
            getTemplate: {
                ifAllOf: ['isAttrParsed', 'isPropDefaulted']
            },
            define: 'mainTemplate',
        }
    },
});
