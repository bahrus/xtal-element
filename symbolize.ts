import {deconstruct} from './xtal-latx.js';

export function symbolize(fn: Function){
    const args = deconstruct(fn);
    const obj: any = {};
    args.forEach(arg =>{
        const sym = Symbol(arg);
        obj[arg] = sym;
    });
    return obj;
}