import {debounce} from './debounce.js';

export function destruct(target: any, prop: string, megaProp: string = '_input'){
    let debouncers = (<any>target)._debouncers;
    if(!debouncers) debouncers =  (<any>target)._debouncers = {};
    let debouncer = debouncers[megaProp];
    if(!debouncer){
        debouncer = debouncers[megaProp] = debounce((t) => {
            (<any>t)[megaProp] = Object.assign({}, (<any>t)[megaProp]);
        }, 10);  //use task sceduler?
    }
    const symb = Symbol(prop);
    const origVal = target[prop];
    Object.defineProperty(target, prop, {
        get: function () {
            return this[symb];
        },
        set: function (val) {
            this[symb] = val;
            if(this[megaProp]) {
                this[megaProp][prop] = val;
                debouncer(this);
            }else{
                this[megaProp] = {[prop]: val}; 
            }
        },
        enumerable: true,
        configurable: true,
    });
    if(origVal !== undefined){
        target[prop] = origVal;
    }
}