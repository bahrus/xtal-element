import {PropDef, PropDefMap, SlicedPropDefs} from '../types.js';
import {attr} from './attr.js';
import {propUp} from './propUp.js';

export function mergeProps<T extends Partial<HTMLElement> = HTMLElement>(self: T, slicedDefs: SlicedPropDefs, defaultVals?: T){
    const copyOfDefaultValues: T = defaultVals === undefined ? {} as T : { ...defaultVals };
    for(const prop of slicedDefs.propDefs){
        if(prop.byoAttrib !== undefined){
            if((self as HTMLElement).hasAttribute(prop.byoAttrib)){
                delete (<any>copyOfDefaultValues)[prop.name!];
            } 
        }
    }
    attr.mergeStr<T>(self as HTMLElement, slicedDefs.strNames, copyOfDefaultValues);
    attr.mergeNum<T>(self as HTMLElement, slicedDefs.numNames, copyOfDefaultValues);
    attr.mergeBool<T>(self as HTMLElement, slicedDefs.boolNames, copyOfDefaultValues);
    
    attr.mergeObj<T>(self as HTMLElement, slicedDefs.parseNames, copyOfDefaultValues);
    propUp(self as HTMLElement, slicedDefs.propNames, copyOfDefaultValues);
    if((<any>self)._internals !== undefined){
        //https://wicg.github.io/custom-state-pseudo-class/#:~:text=A%20custom%20state%20pseudo%20class%20contains%20just%20one,like%20x-foo%3Ais%20%28%3A--state1%2C%20%3A--state2%29%2C%20x-foo%3Anot%20%28%3A--state2%29%2C%20and%20x-foo%3A--state1%3A--state2.
        (<any>self)._internals.states.add('--props-merged');
    }else{
        self.dataset!.propsMerged = '';
    }
}