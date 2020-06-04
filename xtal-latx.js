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
const propCategories = ['bool', 'str', 'num', 'reflect', 'notify', 'obj', 'jsonProp', 'dry', 'log', 'debug'];
const argList = Symbol('argList');
export function deconstruct(fn) {
    if (fn[argList] === undefined) {
        const fnString = fn.toString().trim();
        if (fnString.startsWith('({')) {
            const iPos = fnString.indexOf('})', 2);
            fn[argList] = fnString.substring(2, iPos).split(',').map(s => s.trim());
        }
        else {
            fn[argList] = [];
        }
    }
    return fn[argList];
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
const ignorePropKey = Symbol();
const ignoreAttrKey = Symbol();
const propInfoSym = Symbol('propInfo');
const atrInit = Symbol('atrInit');
export function define(MyElementClass) {
    const props = MyElementClass.props;
    const proto = MyElementClass.prototype;
    const flatProps = [...props.bool, ...props.num, ...props.str, ...props.obj];
    const existingProps = Object.getOwnPropertyNames(proto);
    proto[propInfoSym] = {};
    flatProps.forEach(prop => {
        if (existingProps.includes(prop))
            return;
        const sym = Symbol(prop);
        const propInfo = {};
        propCategories.forEach(cat => {
            propInfo[cat] = props[cat].includes(prop);
        });
        proto[propInfoSym][prop] = propInfo;
        Object.defineProperty(proto, prop, {
            get() {
                return this[sym];
            },
            set(nv) {
                const ik = this[ignorePropKey];
                if (ik !== undefined && ik[prop] === true) {
                    delete ik[prop];
                    this[sym] = nv;
                    return;
                }
                const propInfo = proto[propInfoSym][prop];
                if (propInfo.dry) {
                    if (nv === this[sym])
                        return;
                }
                const c2l = camelToLisp(prop);
                if (propInfo.reflect) {
                    //experimental line -- we want the attribute to take precedence over default value.
                    if (this[atrInit] === undefined && this.hasAttribute(c2l))
                        return;
                    if (this[ignoreAttrKey] === undefined)
                        this[ignoreAttrKey] = {};
                    this[ignoreAttrKey][c2l] = true;
                    if (propInfo.bool) {
                        this.attr(c2l, nv, '');
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
                this[sym] = nv;
                if (propInfo.log) {
                    console.log(propInfo, nv);
                }
                if (propInfo.debug)
                    debugger;
                this.onPropsChange(prop);
                if (propInfo.notify) {
                    this.de(c2l, { value: nv });
                }
            },
        });
    });
    const tagName = MyElementClass.is;
    if (customElements.get(tagName)) {
        console.warn('Already registered ' + tagName);
        return;
    }
    customElements.define(tagName, MyElementClass);
}
export function mergeProps(props1, props2) {
    const returnObj = {};
    propCategories.forEach(propCat => {
        returnObj[propCat] = (props1[propCat] || []).concat(props2[propCat] || []);
    });
    return returnObj;
}
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
                this.evCount = {};
                this.self = this;
                this._xlConnected = false;
                this._propActionQueue = new Set();
            }
            static get evalPath() {
                return lispToCamel(this.is);
            }
            static get observedAttributes() {
                const props = this.props;
                return [...props.bool, ...props.num, ...props.str, ...props.jsonProp].map(s => camelToLisp(s));
            }
            static get props() {
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
                return this[this.evalPath];
            }
            /**
             * Turn number into string with even and odd values easy to query via css.
             * @param n
             */
            to$(n) {
                const mod = n % 2;
                return (n - mod) / 2 + '-' + mod;
            }
            /**
             * Increment event count
             * @param name
             */
            incAttr(name) {
                const ec = this.evCount;
                if (name in ec) {
                    ec[name]++;
                }
                else {
                    ec[name] = 0;
                }
                this.attr('data-' + name, this.to$(ec[name]));
            }
            onPropsChange(name) {
                if (Array.isArray(name)) {
                    name.forEach(subName => this._propActionQueue.add(subName));
                }
                else {
                    this._propActionQueue.add(name);
                }
                if (this.disabled || !this._xlConnected) {
                    return;
                }
                ;
                this.processActionQueue();
            }
            attributeChangedCallback(n, ov, nv) {
                this[atrInit] = true; // track each attribute?
                const ik = this[ignoreAttrKey];
                if (ik !== undefined && ik[n] === true) {
                    delete ik[n];
                    return;
                }
                const propName = lispToCamel(n);
                if (this[ignorePropKey] === undefined)
                    this[ignorePropKey] = {};
                this[ignorePropKey][propName] = true;
                const anyT = this;
                const ep = this.constructor.props;
                if (ep.str.includes(propName)) {
                    anyT[propName] = nv;
                }
                else if (ep.bool.includes(propName)) {
                    anyT[propName] = nv !== null;
                }
                else if (ep.num.includes(propName)) {
                    anyT[propName] = parseFloat(nv);
                }
                else if (ep.jsonProp.includes(propName)) {
                    try {
                        anyT[propName] = JSON.parse(nv);
                    }
                    catch (e) {
                        anyT[propName] = nv;
                    }
                }
                this.onPropsChange(propName);
            }
            connectedCallback() {
                if (super.connectedCallback)
                    super.connectedCallback();
                this._xlConnected = true;
                this.processActionQueue();
                this.onPropsChange('');
            }
            /**
             * Dispatch Custom Event
             * @param name Name of event to dispatch ("-changed" will be appended if asIs is false)
             * @param detail Information to be passed with the event
             * @param asIs If true, don't append event name with '-changed'
             */
            de(name, detail, asIs = false, bubbles = false) {
                if (this.disabled)
                    return;
                const eventName = name + (asIs ? '' : '-changed');
                const newEvent = new CustomEvent(eventName, {
                    detail: detail,
                    bubbles: bubbles,
                    composed: false,
                    cancelable: true,
                });
                this.dispatchEvent(newEvent);
                this.incAttr(eventName);
                return newEvent;
            }
            processActionQueue() {
                if (this.propActions === undefined)
                    return;
                this.propActions.forEach(propAction => {
                    const dependencies = deconstruct(propAction);
                    const dependencySet = new Set(dependencies);
                    if (intersection(this._propActionQueue, dependencySet).size > 0) {
                        propAction(this);
                    }
                });
                this._propActionQueue = new Set();
            }
        },
        _a.attributeProps = ({ disabled }) => ({
            bool: [disabled],
        }),
        _a;
}
