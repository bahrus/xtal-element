import {destructPropInfo, PropDef, PropDefGet} from '../types.js';
import {getPropDefs} from './getPropDefs.js';

export function getSlicedPropDefs(propDefGetters: destructPropInfo[]){
    const propDefs = getPropDefs(propDefGetters);
    const propNames = propDefs.map(propDef => propDef.name!);
    const strNames = propDefs.filter(propDef => propDef.type === String).map(propDef => propDef.name!);
    const boolNames = propDefs.filter(propDef => propDef.type === Boolean).map(propDef => propDef.name!);
    const numNames = propDefs.filter(propDef => propDef.type === Number).map(propDef => propDef.name!);
    const parseNames = propDefs.filter(propDef => propDef.parse).map(propDef => propDef.name!);
    const propLookup: {[key: string]: PropDef} = {};
    for(const propDef of propDefs){
        propLookup[propDef.name!] = propDef;
    }
    return {propDefs, propNames, strNames, boolNames, parseNames, propLookup};
}
