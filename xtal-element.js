import { O } from 'trans-render/froop/O.js';
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
        const { aka } = self;
        console.log({ aka });
        return {};
    }
}
