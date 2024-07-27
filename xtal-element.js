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
            propDefaults: {
                type: 'Object',
                attrName: 'prop-defaults',
                parse: true,
            },
            propInfo: {
                type: 'Object',
                attrName: 'prop-info',
                parse: true,
            },
            actions: {
                type: 'Object',
                attrName: 'actions',
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
                parse: true,
            },
            xform: {
                type: 'Object',
                attrName: 'xform',
                parse: true,
            },
            shadowRootMode: {
                type: 'String',
                attrName: 'shadow-root-mode',
                parse: true,
            },
            inherits: {
                type: 'String',
                attrName: 'inherits',
                parse: true,
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
        const { aka, mainTemplate, assumeCSR, inferProps, xform, propInfo, propDefaults, shadowRootMode, inherits, actions, styles } = self;
        const inferredProps = {};
        const inferredXForm = {};
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
                        parse: true,
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
                        prop.type = 'String';
                    }
                    inferredProps[propName] = prop;
                    inferredXForm[`| ${propName}`] = 0;
                }
            }
        }
        let shadowRootInit;
        if (shadowRootMode) {
            shadowRootInit = {
                mode: shadowRootMode
            };
        }
        let inheritingClass = Mount;
        switch (typeof inherits) {
            case 'string':
                inheritingClass = (await customElements.whenDefined(inherits));
                break;
            case 'function':
                if (inherits.bootUp) {
                    inheritingClass = inherits;
                }
                else {
                    if (inherits.constructor.name === 'AsyncFunction') {
                        inheritingClass = (await inherits());
                    }
                }
        }
        const ctr = class extends inheritingClass {
            localize = localize;
            static config = {
                assumeCSR,
                mainTemplate: mainTemplate,
                shadowRootInit,
                propDefaults: {
                    ...propDefaults
                },
                propInfo: {
                    ...super.mntCfgMxn.propInfo,
                    ...inferredProps,
                    ...propInfo
                },
                actions: {
                    ...super.mntCfgMxn.actions,
                    ...actions
                },
                xform: { ...inferredXForm, ...xform },
                styles
            };
        };
        await ctr.bootUp();
        customElements.define(aka, ctr);
        return {};
    }
}
