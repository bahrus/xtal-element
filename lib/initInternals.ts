import {IInternals} from '../types.d.js';

export function initInternals(el: IInternals){
    const aThis = this as any;
    if(aThis.attachInternals !== undefined){
        el._internals = aThis.attachInternals();
    }
}