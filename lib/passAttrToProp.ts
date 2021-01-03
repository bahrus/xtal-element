import {lispToCamel} from './lispToCamel.js'; 

function passAttrToProp<T extends HTMLElement = HTMLElement>(self: T, slicedPropDefs: SlicedPropDefs, name: string, oldValue: string, newValue: string){
    const propDef = slicedPropDefs.propLookup[lispToCamel(name)];
    if(propDef !== undefined){

    }
}