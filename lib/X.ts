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
        const s = new Set<string>();
        for(const propAction of propActions.flat()){
            const props = getDestructArgs(propAction);
            for(const prop of props){
                s.add(prop);
            }
        }
        class newClass extends (config.class || X){
            static is = config.name;
            mainTemplate = config.mainTemplate;
            refs = config.refs;
            propActions = propActions;

        }
        const propDefs = Array.from(s).map<PropDef>(prop => ({
            name: prop,
            type: Object,
            dry: true,
            async: true,
        }));
        xc.letThereBeProps(newClass, propDefs, 'onPropChange');
        xc.define(newClass);
    }
}
