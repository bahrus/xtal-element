import { debounce } from './debounce.js';
export function getScript(srcScript, ignore) {
    const inner = srcScript.innerHTML.trim();
    //const trEq = 'tr = ';
    if (inner.startsWith('(') || inner.startsWith(ignore)) {
        const ied = self['xtal_latx_ied']; //IE11
        if (ied !== undefined) {
            return ied(inner);
        }
        else {
            const iFatArrowPos = inner.indexOf('=>');
            const c2del = ['(', ')', '{', '}'];
            let lhs = inner.substr(0, iFatArrowPos).replace(ignore, '').trim();
            c2del.forEach(t => lhs = lhs.replace(t, ''));
            const rhs = inner.substr(iFatArrowPos + 2);
            return {
                args: lhs.split(',').map(s => s.trim()),
                body: rhs,
            };
        }
    }
    else {
        return null;
    }
}
export function destruct(target, prop, megaProp = 'input') {
    let debouncers = target._debouncers;
    if (!debouncers)
        debouncers = target._debouncers = {};
    let debouncer = debouncers[megaProp];
    if (!debouncer) {
        debouncer = debouncers[megaProp] = debounce((t) => {
            t[megaProp] = Object.assign({}, t[megaProp]);
        }, 10); //use task sceduler?
    }
    Object.defineProperty(target, prop, {
        get: function () {
            return this['_' + prop];
        },
        set: function (val) {
            this['_' + prop] = val;
            if (this[megaProp]) {
                this[megaProp][prop] = val;
                debouncer(this);
                //this[megaProp] = Object.assign({}, this[megaProp]);
            }
            else {
                this[megaProp] = { [prop]: val };
            }
        },
        enumerable: true,
        configurable: true,
    });
}
