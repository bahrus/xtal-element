import {IInternals} from '../types.d.js';

//https://wicg.github.io/custom-state-pseudo-class/#:~:text=A%20custom%20state%20pseudo%20class%20contains%20just%20one,like%20x-foo%3Ais%20%28%3A--state1%2C%20%3A--state2%29%2C%20x-foo%3Anot%20%28%3A--state2%29%2C%20and%20x-foo%3A--state1%3A--state2.
export function initInternals(el: IInternals){
    const aThis = this as any;
    if(aThis.attachInternals !== undefined){
        el._internals = aThis.attachInternals();
    }
}