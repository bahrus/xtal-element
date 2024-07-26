import {O, OConfig} from 'trans-render/froop/O.js';
import {Actions, AP, ProAP} from './types';

// used for generating the web component
import {MntCfg, Mount, MountActions, MountProps} from 'trans-render/Mount.js';
import {localize} from 'trans-render/funions/Localizer.js';
import { ITransformer, UnitOfWork, XForm } from 'trans-render/types.js';
import { PropInfo } from 'trans-render/froop/types';

export class XtalElement extends O implements Actions{
    static override config: OConfig<AP, Actions> = {
        propInfo:{
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
            actions:{
                type: 'Object',
                attrName: 'actions',
                parse: true,
            },
            formAss:{
                type: 'Boolean',
                attrName: 'form-associated',
                parse: true,
            },
            inferProps:{
                def: false,
                type: 'Boolean',
                attrName: 'infer-props',
                parse: true
            },
            propInferenceCriteria:{
                def: [{
                    cssSelector: '[itemprop]',
                    attrForProp: 'itemprop',
                }],
                type: 'Object',
                attrName: 'prop-inference-criteria',
                parse: true,
            },
            xform:{
                type: 'Object',
                attrName: 'xform',
                parse: true,
            },
            shadowRootMode: {
                type: 'String',
                attrName: 'shadow-root-mode',
                parse: true,
            },
            inherits:{
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

    async define(self: this){
        const {aka, mainTemplate, assumeCSR, inferProps, xform,
            propInfo, propDefaults, shadowRootMode, inherits, actions
        } = self;
        const inferredProps: {[key: string]: PropInfo} = {};
        const inferredXForm: XForm<any, any> = {};
        if(inferProps){
            const {propInferenceCriteria} = self;
            const content = mainTemplate!.content;
            
            const {camelToLisp} = await import('trans-render/lib/camelToLisp.js');
            for(const criteria of propInferenceCriteria!){
                const {cssSelector, attrForProp} = criteria;
                const matches = Array.from(content.querySelectorAll(cssSelector));
                for(const match of matches){
                    const propName = match.getAttribute(attrForProp)!;
                    const {localName} = match;
                    let prop: PropInfo = {
                        attrName: camelToLisp(propName),
                        parse: true,
                    }
                    if(match instanceof HTMLLinkElement){
                        const {href} = match;
                        Object.assign(prop, {
                            type: 'Boolean',
                            def: !href ? undefined : href.endsWith('True') ? true : false
                        } as PropInfo)
                        match.href = '';
                    }else{
                        prop.type = 'String';
                    }
                    inferredProps[propName] = prop;
                    inferredXForm[`| ${propName}`] = 0;
                }
            }
        }
        let shadowRootInit: ShadowRootInit | undefined;
        if(shadowRootMode){
            shadowRootInit = {
                mode: shadowRootMode
            }
        }
        let inheritingClass = Mount;
        switch(typeof inherits){
            case 'string':
                inheritingClass = (await customElements.whenDefined(inherits)) as typeof Mount;
                break;
            case 'function':
                if((<any>inherits).bootUp) {
                    inheritingClass = inherits as typeof Mount;
                }else{
                    if(inherits.constructor.name === 'AsyncFunction'){
                        inheritingClass = (await (<any>inherits)()) as typeof Mount;
                    }
                    
                }

        }
        const ctr = class extends inheritingClass {
            localize = localize;
            static override config: MntCfg = {
                assumeCSR,
                mainTemplate: mainTemplate!,
                shadowRootInit,
                propDefaults: {
                    ...propDefaults
                },
                propInfo: {
                    ...super.mntCfgMxn.propInfo,
                    ...inferredProps,
                    ...propInfo
                },
                actions:{
                    ...super.mntCfgMxn.actions,
                    ...actions
                },
                xform: {...inferredXForm, ...xform}
            }
        }
        await ctr.bootUp();
        customElements.define(aka!, ctr);
        return {

        } as AP;
    }
}

export interface XtalElement extends AP{}