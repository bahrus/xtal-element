import { deconstruct } from './xtal-latx.js';
export function symbolize(fn) {
    const args = deconstruct(fn);
    const obj = {};
    args.forEach(arg => {
        const sym = Symbol(arg);
        obj[arg] = sym;
    });
    return obj;
}
