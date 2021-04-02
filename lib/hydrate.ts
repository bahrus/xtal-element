import {PropDef, PropDefMap, SlicedPropDefs} from '../types.d.js';
import {attr} from './attr.js';
import {propUp} from './propUp.js';

export function hydrate<T extends Partial<HTMLElement> = HTMLElement>(self: T, slicedDefs: SlicedPropDefs, defaultVals?: T){
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
    self.dataset!.isHydrated = '';
}