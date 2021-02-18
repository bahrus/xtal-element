import { ReactiveSurface, PropAction, XtalPattern, PropDef, XConfig, PropDefMap } from '../types.js';
import { RxSuppl } from './RxSuppl.js';
import {xc} from './XtalCore.js';
import {xp} from './XtalPattern.js';
import {DOMKeyPE} from './DOMKeyPE.js';
import {getDestructArgs} from './getDestructArgs.js';
import { getSlicedPropDefs } from './getSlicedPropDefs.js';

export  class X extends HTMLElement {
    self = this;
    static observedAttributes = ['disabled'];
    attributeChangedCallback(n: string, ov: string, nv: string){
        this.disabled = nv !== null;
    }
    disabled: boolean | undefined;
    domCache: any;
    reactor: RxSuppl | undefined;
    onPropChange(name: string, prop: PropDef, nv: any){
        if(this.reactor === undefined){
            this.reactor = new xp.RxSuppl(this as any as ReactiveSurface, [
                {
                    rhsType: Array,
                    ctor: DOMKeyPE
                }
            ]);            
        }
        this.reactor!.addToQueue(prop, nv);
    }


    static tend(config: XConfig){
        const propActions = [xp.manageMainTemplate, config.propActions, config.noShadow ? xp.appendClone : xp.createShadow] as PropAction[];

        class newClass extends (config.class || X){
            static is = config.name;
            mainTemplate = config.mainTemplate;
            refs = config.refs;
            propActions = propActions;

        }
        //const nativeProps = xc.getPropDefs(xp.props);
        let propDefs = config.propDefs;
        if(propDefs === undefined){
            const s = new Set<string>();
            
            for(const propAction of config.propActions.flat()){
                const props = getDestructArgs(propAction);
                for(const prop of props){
                    if((<any>xp.props)[prop] === undefined && prop !== 'self'){
                        s.add(prop);
                    }
                    
                }
            }
            const common = {
                type: Object,
                dry: true,
                async: true,
            } as PropDef;
            propDefs = {};
            Array.from(s).forEach(prop => {
                propDefs![prop] = common;
            });
        }
        const allPropDefs = {...xp.props, ...propDefs};
        const slicedPropDefs = getSlicedPropDefs(allPropDefs);
        xc.letThereBeProps(newClass as any as {new(): X}, slicedPropDefs.propDefs, 'onPropChange');
        xc.define(newClass);
    }
}
