import { O } from 'trans-render/froop/O.js';
// used for generating the web component
import { Mount } from 'trans-render/Mount.js';
import { localize } from 'trans-render/funions/Localizer.js';
export class XtalElement extends O {
    static config = {
        propInfo: {
            targetScope: {
                def: 'porn',
                attrName: 'target-scope',
                parse: true,
            },
            mainTemplate: {
                type: 'Object'
            },
            aka: {
                type: 'String',
                attrName: 'aka',
                parse: true,
            },
            assumeCSR: {
                type: 'Boolean',
                def: false,
                attrName: 'assume-csr',
                parse: true,
            },
            inferProps: {
                def: false,
                type: 'Boolean',
                attrName: 'infer-props',
                parse: true
            },
            propInferenceCriteria: {
                def: [{
                        cssSelector: '[itemprop]',
                        attrForProp: 'itemprop',
                    }],
                type: 'Object',
                attrName: 'prop-inference-criteria',
                parse: true
            }
        },
        actions: {
            getTemplate: {
                ifAllOf: ['targetScope']
            },
            define: {
                ifAllOf: ['mainTemplate']
            }
        }
    };
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
                if (xtalE !== null) {
                    xtalE.remove();
                }
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
        const { aka, mainTemplate, assumeCSR, inferProps } = self;
        const inferredProps = {};
        if (inferProps) {
            const { propInferenceCriteria } = self;
            const content = mainTemplate.content;
            const { camelToLisp } = await import('trans-render/lib/camelToLisp.js');
            for (const criteria of propInferenceCriteria) {
                const { cssSelector, attrForProp } = criteria;
                const matches = Array.from(content.querySelectorAll(cssSelector));
                for (const match of matches) {
                    const propName = match.getAttribute(attrForProp);
                    const { localName } = match;
                    let prop = {
                        attrName: camelToLisp(propName),
                    };
                    if (match instanceof HTMLLinkElement) {
                        const { href } = match;
                        Object.assign(prop, {
                            type: 'Boolean',
                            def: !href ? undefined : href.endsWith('True') ? true : false
                        });
                        match.href = '';
                    }
                    else {
                        prop = {
                            type: 'String'
                        };
                    }
                    inferredProps[propName] = prop;
                }
            }
        }
        const ctr = class extends Mount {
            localize = localize;
            static config = {
                assumeCSR,
                mainTemplate: mainTemplate,
                propInfo: {
                    ...super.mntCfgMxn.propInfo,
                    ...inferredProps,
                },
                actions: {
                    ...super.mntCfgMxn.actions
                },
                xform: {}
            };
        };
        await ctr.bootUp();
        customElements.define(aka, ctr);
        return {};
    }
}
