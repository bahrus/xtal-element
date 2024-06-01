import {O, OConfig} from 'trans-render/froop/O.js';
import {Actions, AP, ProAP} from './types';

export class XtalElement extends O implements Actions{
    static override config: OConfig<AP, Actions> = {
        propInfo:{
            targetScope: {
                def: 'porn'
            }
        },
        actions: {
            getTemplate: {
                ifAllOf: ['targetScope']
            }
        }
    }

    async getTemplate(self: this){
        const {targetScope, aka} = self;
        const {findRealm} = await import('trans-render/lib/findRealm.js');
        const rn = await findRealm(self, targetScope!) as DocumentFragment;
        if(aka === undefined){
            if(rn instanceof Element){
                self.aka = rn.localName;
                (<any>rn).skipTemplateClone = true;
            }else if((<any>rn).host !== undefined){
                const host = (<any>rn).host;
                self.shadowRootMode = 'open'; //how do we detect closed?
                self.aka = host.localName;
                host.skipTemplateClone = true;
            }else{
                throw 404;
            }
        }
        let blowDry = rn.querySelector('blow-dry');
        let mainTemplate: HTMLTemplateElement | undefined;
        if(blowDry === null){
            import('blow-dry/blow-dry.js');
            blowDry = document.createElement('blow-dry');
            blowDry.addEventListener('resolved', e => {
                mainTemplate = (<any>blowDry).canonicalTemplate as HTMLTemplateElement;
                const xtalE = mainTemplate.content.querySelector('xtal-element');
                if(xtalE !== null){
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
        } as AP;
    }
}

export interface XtalElement extends AP{}