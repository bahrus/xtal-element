import {lispToCamel} from './lispToCamel.js'; 
import {SlicedPropDefs} from '../types.d.js';
export function passAttrToProp<T extends HTMLElement = HTMLElement>(self: T, slicedPropDefs: SlicedPropDefs, name: string, oldValue: string, newValue: string){
    if(self.dataset.isHydrated === undefined) return;
    const camelName = lispToCamel(name);
    const propDef = slicedPropDefs.propLookup[camelName];
    if(propDef !== undefined){
        let parsedNewVal: any = newValue;
        switch(propDef.type){
            case Number:
                parsedNewVal = newValue.includes('.') ? parseFloat(newValue) : parseInt(newValue);
                break;
            case Boolean:
                parsedNewVal = newValue !== '';
                break;
            case Object:
                if(!propDef.parse) return;
                parsedNewVal = JSON.parse(newValue);
                break;
        }
        (self as any)[camelName] = parsedNewVal;
    }
}