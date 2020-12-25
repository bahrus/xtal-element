import {destructPropInfo, PropDef, PropDefGet} from '../types.d.js';
import {getDestructArgs} from './getDestructArgs.js';

export function getPropDefs(proppers: destructPropInfo[]): PropDef[]{
    const returnObj : PropDef[] = [];
    for(const propper of proppers){
        const args = getDestructArgs(propper);
        const propDef = propper(0);
        for(var arg of args){
            const propDefClone = {...propDef};
            propDefClone.name = arg;
            returnObj.push(propDefClone);
        }
    }
    return returnObj;
}