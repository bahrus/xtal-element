import { ReactiveSurface, PropAction, XtalPattern, PropDef, XConfig } from '../types.js';
import { Reactor } from './Reactor.js';
import {xc} from './XtalCore.js';
import {xp} from './XtalPattern.js';
import {DOMKeyPE} from './DOMKeyPE.js';
import {getDestructArgs} from './getDestructArgs.js';
import { letThereBeProps } from './letThereBeProps.js';

export abstract class X extends HTMLElement {
    self = this;
    abstract reactor: Reactor;
    onPropChange(name: string, prop: PropDef, nv: any){
        this.reactor.addToQueue(prop, nv);
    }

    static tend(config: XConfig){
        const propActions = [xp.manageMainTemplate, config.propActions, xp.attachShadow] as PropAction[];
        const s = new Set<string>();
        for(const propAction of propActions.flat()){
            const props = getDestructArgs(propAction);
            for(const prop of props){
                s.add(prop);
            }
        }
        class newClass extends X implements ReactiveSurface, XtalPattern{
            static is = config.name;
            mainTemplate = config.mainTemplate;
            refs = config;
            propActions = propActions;
            reactor = new xc.Reactor(this, [
                {
                    type: Array,
                    ctor: DOMKeyPE
                }
            ]);
        }
        const propDefs = Array.from(s).map<PropDef>(prop => ({
            name: prop,
            type: Object,
            dry: true,
            async: true,
        }));
        xc.letThereBeProps(newClass, propDefs);
        xc.define(newClass);
    }
}
