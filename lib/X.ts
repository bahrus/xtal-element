import { ReactiveSurface, PropAction, XtalPattern, PropDef, XConfig } from '../types.js';
import { Reactor } from './Reactor.js';
import {xc} from './XtalCore.js';
import {xp} from './XtalPattern.js';
import {DOMKeyPE} from './DOMKeyPE.js';
import {getDestructArgs} from './getDestructArgs.js';

export  class X extends HTMLElement {
    self = this;
    domCache: any;
    reactor: Reactor | undefined;
    onPropChange(name: string, prop: PropDef, nv: any){
        if(this.reactor === undefined){
            this.reactor = new xc.Reactor(this as any as ReactiveSurface, [
                {
                    type: Array,
                    ctor: DOMKeyPE
                }
            ]);            
        }
        this.reactor!.addToQueue(prop, nv);
    }


    static tend(config: XConfig){
        const propActions = [xp.manageMainTemplate, config.propActions, xp.createShadow] as PropAction[];

        class newClass extends (config.class || X){
            static is = config.name;
            mainTemplate = config.mainTemplate;
            refs = config.refs;
            propActions = propActions;

        }
        const nativeProps = xc.getPropDefs(xp.props);
        let propDefs = config.propDefs;
        if(propDefs === undefined){
            const s = new Set<string>();
            
            for(const propAction of config.propActions.flat()){
                const props = getDestructArgs(propAction);
                for(const prop of props){
                    if(nativeProps.findIndex(x => x.name === prop) === -1 && prop !== 'self'){
                        s.add(prop);
                    }
                    
                }
            }
            propDefs = Array.from(s).map<PropDef>(prop => ({
                name: prop,
                type: Object,
                dry: true,
                async: true,
            }));
        }
        const allPropDefs = propDefs.concat(nativeProps);
        xc.letThereBeProps(newClass, allPropDefs, 'onPropChange');
        xc.define(newClass);
    }
}
