import { debounce } from './debounce.js';
export function destruct(target, prop, megaProp = '_input') {
    let debouncers = target._debouncers;
    if (!debouncers)
        debouncers = target._debouncers = {};
    let debouncer = debouncers[megaProp];
    if (!debouncer) {
        debouncer = debouncers[megaProp] = debounce((t) => {
            t[megaProp] = Object.assign({}, t[megaProp]);
        }, 10); //use task sceduler?
    }
    const symb = Symbol(prop);
    const origVal = target[prop];
    Object.defineProperty(target, prop, {
        get: function () {
            return this[symb];
        },
        set: function (val) {
            if (this[symb] === val)
                return;
            this[symb] = val;
            if (this[megaProp]) {
                this[megaProp][prop] = val;
                debouncer(this);
            }
            else {
                this[megaProp] = { [prop]: val };
            }
        },
        enumerable: true,
        configurable: true,
    });
    if (origVal !== undefined) {
        target[prop] = origVal;
    }
}
