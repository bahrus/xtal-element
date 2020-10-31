import { debounce } from './debounce.js';
export { hydrate } from 'trans-render/hydrate.js';
/**
 * Base class for many xtal- components
 * @param superClass
 */
export function XtallatX(superClass) {
    var _a;
    return _a = class extends superClass {
            constructor() {
                super(...arguments);
                /**
                 * Tracks how many times each event type was called.
                 */
                this.__evCount = {};
                /**
                 * @private
                 */
                this.self = this;
                this._xlConnected = false;
                this.__propActionQueue = new Set();
            }
            /**
             * @private
             */
            static get evalPath() {
                return lispToCamel(this.is);
            }
            /**
             * @private
             */
            static get observedAttributes() {
                const props = this.props;
                return [...props.bool, ...props.num, ...props.str, ...props.jsonProp].map(s => camelToLisp(s));
            }
            static get props() {
                if (this.is === undefined)
                    return {};
                if (this[this.evalPath] === undefined) {
                    const args = deconstruct(this.attributeProps);
                    const arg = {};
                    args.forEach(token => {
                        arg[token] = token;
                    });
                    this[this.evalPath] = this.attributeProps(arg);
                    const ep = this[this.evalPath];
                    propCategories.forEach(propCat => {
                        ep[propCat] = ep[propCat] || [];
                    });
                }
                let props = this[this.evalPath];
                const superProps = Object.getPrototypeOf(this).props;
                if (superProps !== undefined)
                    props = mergeProps(props, superProps);
                return props;
            }
            /**
             * Turn number into string with even and odd values easy to query via css.
             * @param n
             */
            __to$(n) {
                const mod = n % 2;
                return (n - mod) / 2 + '-' + mod;
            }
            /**
             * Increment event count
             * @param name
             */
            __incAttr(name) {
                const ec = this.__evCount;
                if (name in ec) {
                    ec[name]++;
                }
                else {
                    ec[name] = 0;
                }
                this.attr('data-' + name, this.__to$(ec[name]));
            }
            onPropsChange(name) {
                let isAsync = false;
                const propInfoLookup = this.constructor[propInfoSym];
                if (Array.isArray(name)) {
                    name.forEach(subName => {
                        this.__propActionQueue.add(subName);
                        const propInfo = propInfoLookup[subName];
                        if (propInfo !== undefined && propInfo.async)
                            isAsync = true;
                    });
                }
                else {
                    this.__propActionQueue.add(name);
                    const propInfo = propInfoLookup[name];
                    if (propInfo !== undefined && propInfo.async)
                        isAsync = true;
                }
                if (this.disabled || !this._xlConnected) {
                    return;
                }
                ;
                if (!this.disabled) {
                    if (isAsync) {
                        this.__processActionDebouncer();
                    }
                    else {
                        this.__processActionQueue();
                    }
                }
            }
            attributeChangedCallback(n, ov, nv) {
                //(<any>this)[atrInit] = true; // track each attribute?
                wmAtrInit.set(this, true);
                const ik = this[ignoreAttrKey];
                if (ik !== undefined && ik[n] === true) {
                    delete ik[n];
                    return;
                }
                const propName = lispToCamel(n);
                const privatePropName = '_' + propName;
                //TODO:  Do we need this?
                // if((<any>this)[ignorePropKey] === undefined) (<any>this)[ignorePropKey] = {};
                // (<any>this)[ignorePropKey][propName] = true;
                const anyT = this;
                const ep = this.constructor.props;
                if (ep.str.includes(propName)) {
                    anyT[privatePropName] = nv;
                }
                else if (ep.bool.includes(propName)) {
                    anyT[privatePropName] = nv !== null;
                }
                else if (ep.num.includes(propName)) {
                    anyT[privatePropName] = parseFloat(nv);
                }
                else if (ep.jsonProp.includes(propName)) {
                    try {
                        anyT[privatePropName] = JSON.parse(nv);
                    }
                    catch (e) {
                        anyT[privatePropName] = nv;
                    }
                }
                this.onPropsChange(propName);
            }
            connectedCallback() {
                super.connectedCallback();
                this._xlConnected = true;
                this.__processActionDebouncer();
                this.onPropsChange('');
            }
            /**
             * Dispatch Custom Event
             * @param name Name of event to dispatch ("-changed" will be appended if asIs is false)
             * @param detail Information to be passed with the event
             * @param asIs If true, don't append event name with '-changed'
             * @private
             */
            [de](name, detail, asIs = false) {
                if (this.disabled)
                    return;
                const eventName = name + (asIs ? '' : '-changed');
                let bubbles = false;
                let composed = false;
                let cancelable = false;
                if (this.eventScopes !== undefined) {
                    const eventScope = this.eventScopes.find(x => (x[0] === undefined) || x[0].startsWith(eventName));
                    if (eventScope !== undefined) {
                        bubbles = eventScope[1] === 'bubbles';
                        cancelable = eventScope[2] === 'cancelable';
                        composed = eventScope[3] === 'composed';
                    }
                }
                const newEvent = new CustomEvent(eventName, {
                    detail: detail,
                    bubbles: bubbles,
                    composed: composed,
                    cancelable: cancelable,
                });
                this.dispatchEvent(newEvent);
                this.__incAttr(eventName);
                return newEvent;
            }
            get __processActionDebouncer() {
                if (this.___processActionDebouncer === undefined) {
                    this.___processActionDebouncer = debounce((getNew = false) => {
                        this.__processActionQueue();
                    }, 16);
                }
                return this.___processActionDebouncer;
            }
            propActionsHub(propAction) { }
            __processActionQueue() {
                if (this.propActions === undefined)
                    return;
                const queue = this.__propActionQueue;
                this.__propActionQueue = new Set();
                this.propActions.forEach(propAction => {
                    const dependencies = deconstruct(propAction);
                    const dependencySet = new Set(dependencies);
                    if (intersection(queue, dependencySet).size > 0) {
                        this.propActionsHub(propAction);
                        propAction(this);
                    }
                });
            }
        },
        /**
         * @private
         * @param param0
         */
        _a.attributeProps = ({ disabled }) => ({
            bool: [disabled],
        }),
        _a;
}
//utility fns
//const ignorePropKey = Symbol();
const ignoreAttrKey = Symbol();
const propInfoSym = Symbol('propInfo');
//const atrInit = Symbol('atrInit');
const wmAtrInit = new WeakMap();
export function define(MyElementClass) {
    const tagName = MyElementClass.is;
    let n = 0;
    let foundIt = false;
    let isNew = false;
    let name = tagName;
    do {
        if (n > 0)
            name = `${tagName}-${n}`;
        const test = customElements.get(name);
        if (test !== undefined) {
            if (test === MyElementClass) {
                foundIt = true; //all good;
                MyElementClass.isReally = name;
            }
            else {
                //do nothing, which will cause next name to be tested
            }
        }
        else {
            isNew = true;
            MyElementClass.isReally = name;
            foundIt = true;
        }
        n++;
    } while (!foundIt);
    if (!isNew)
        return;
    const props = MyElementClass.props;
    const proto = MyElementClass.prototype;
    const flatProps = [...props.bool, ...props.num, ...props.str, ...props.obj];
    const existingProps = Object.getOwnPropertyNames(proto);
    MyElementClass[propInfoSym] = {};
    flatProps.forEach(prop => {
        if (existingProps.includes(prop))
            return;
        const privateKey = '_' + prop;
        const propInfo = {};
        propCategories.forEach(cat => {
            propInfo[cat] = props[cat].includes(prop);
        });
        MyElementClass[propInfoSym][prop] = propInfo;
        //TODO:  make this a bound function?
        Object.defineProperty(proto, prop, {
            get() {
                return this[privateKey];
            },
            set(nv) {
                const propInfo = MyElementClass[propInfoSym][prop];
                if (propInfo.dry) {
                    if (nv === this[privateKey])
                        return;
                }
                const c2l = camelToLisp(prop);
                if (propInfo.reflect) {
                    //experimental line -- we want the attribute to take precedence over default value.
                    if (!wmAtrInit.has(this) && this.hasAttribute(c2l))
                        return;
                    //if(this[atrInit] === undefined && this.hasAttribute(c2l)) return;
                    if (this[ignoreAttrKey] === undefined)
                        this[ignoreAttrKey] = {};
                    this[ignoreAttrKey][c2l] = true;
                    if (propInfo.bool) {
                        if ((nv && !this.hasAttribute(c2l)) || nv === false) {
                            this.attr(c2l, nv, '');
                        }
                        else {
                            this[ignoreAttrKey][c2l] = false;
                        }
                    }
                    else if (propInfo.str) {
                        this.attr(c2l, nv);
                    }
                    else if (propInfo.num) {
                        this.attr(c2l, nv.toString());
                    }
                    else if (propInfo.obj) {
                        this.attr(c2l, JSON.stringify(nv));
                    }
                }
                this[privateKey] = nv;
                if (propInfo.log) {
                    console.log(propInfo, nv);
                }
                if (propInfo.debug)
                    debugger;
                this.onPropsChange(prop);
                if (propInfo.notify) {
                    this[de](c2l, { value: nv });
                }
            },
            enumerable: true,
            configurable: true
        });
    });
    customElements.define(name, MyElementClass);
}
export const de = Symbol.for('1f462044-3fe5-4fa8-9d26-c4165be15551');
export function mergeProps(props1, props2) {
    const returnObj = {};
    propCategories.forEach(propCat => {
        returnObj[propCat] = (props1[propCat] || []).concat(props2[propCat] || []);
    });
    return returnObj;
}
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set
export function intersection(setA, setB) {
    let _intersection = new Set();
    for (let elem of setB) {
        if (setA.has(elem)) {
            _intersection.add(elem);
        }
    }
    return _intersection;
}
const ltcRe = /(\-\w)/g;
export function lispToCamel(s) {
    return s.replace(ltcRe, function (m) { return m[1].toUpperCase(); });
}
const ctlRe = /[\w]([A-Z])/g;
export function camelToLisp(s) {
    return s.replace(ctlRe, function (m) {
        return m[0] + "-" + m[1];
    }).toLowerCase();
}
export const p = Symbol('placeholder');
export function symbolize(obj) {
    for (var key in obj) {
        obj[key] = Symbol(key);
    }
}
const propCategories = ['bool', 'str', 'num', 'reflect', 'notify', 'obj', 'jsonProp', 'dry', 'log', 'debug', 'async'];
const argList = Symbol('argList');
export function substrBefore(s, search) {
    let returnS = s.trim();
    let iPosOfColon = returnS.indexOf(search);
    if (iPosOfColon > -1)
        return returnS.substr(0, iPosOfColon);
    return returnS;
}
export function deconstruct(fn) {
    if (fn[argList] === undefined) {
        const fnString = fn.toString().trim();
        if (fnString.startsWith('({')) {
            const iPos = fnString.indexOf('})', 2);
            fn[argList] = fnString.substring(2, iPos).split(',').map(s => substrBefore(s, ':'));
        }
        else {
            fn[argList] = [];
        }
    }
    return fn[argList];
}
