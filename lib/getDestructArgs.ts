import {substrBefore} from './substrBefore.js';
export function getDestructArgs(fn: Function){
    const fnString = fn.toString().trim();
    if(fnString.startsWith('({')){
        const iPos = fnString.indexOf('})', 2);
        return fnString.substring(2, iPos).split(',').map(s => substrBefore(s, ':'));
    }else{
        return [];
    }
}
