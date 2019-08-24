import {debounce} from './debounce.js';
export interface IScriptInfo{
    args: string[],
    body: string,
}
export function  getScript(srcScript: HTMLScriptElement, ignore: string) : IScriptInfo | null{
    const inner = srcScript.innerHTML.trim();
    //const trEq = 'tr = ';
    if(inner.startsWith('(') || inner.startsWith(ignore)){
        const ied = (<any>self)['xtal_latx_ied']; //IE11
        if(ied !== undefined){ 
            return ied(inner);
        }else{
            const iFatArrowPos = inner.indexOf('=>');
            const c2del = ['(', ')', '{', '}'];
            let lhs = inner.substr(0, iFatArrowPos).replace(ignore, '').trim();
            c2del.forEach(t => lhs = lhs.replace(t, ''));
            const rhs = inner.substr(iFatArrowPos + 2);
            return {
                args: lhs.split(',').map(s => s.trim()),
                body: rhs,
            }
        }
        
    }else{
        return null;
    }
    
}

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
                //this[megaProp] = Object.assign({}, this[megaProp]);
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