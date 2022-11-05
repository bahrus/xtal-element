import {debounce} from './debounce.js';
import {camelToLisp} from 'trans-render/lib/camelToLisp.js';
import { attr } from './attr.js';

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
    let origVal = target[prop];
    if(origVal === undefined){
        const attrVal = target.getAttribute(camelToLisp(prop));
        if(attrVal !== null){
            try{
                origVal = JSON.parse(attrVal);
            }catch(e){
                origVal = attrVal;//TODO:  use default values with destructuring to guess the type?
            }
            
        }
    }
    Object.defineProperty(target, prop, {
        get: function () {
            return this[symb];
        },
        set: function (val) {
            //if(this[symb] === val) return;
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