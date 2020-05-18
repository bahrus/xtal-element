import { disabled } from 'trans-render/hydrate.js';
const ltcRe = /(\-\w)/g;
export function lispToCamel(s) {
    return s.replace(ltcRe, function (m) { return m[1].toUpperCase(); });
}
const ctlRe = /[\w]([A-Z])/g;
function camelToLisp(s) {
    return s.replace(ctlRe, function (m) {
        return m[0] + "-" + m[1];
    }).toLowerCase();
}
export function deconstruct(fn) {
    const fnString = fn.toString().trim();
    if (fnString.startsWith('({')) {
        const iPos = fnString.indexOf('})', 2);
        return fnString.substring(2, iPos).split(',').map(s => s.trim());
    }
    return [];
}
export function define(MyElementClass) {
    const props = MyElementClass['evaluatedProps'];
    const proto = MyElementClass.prototype;
    const flatProps = [...props.boolean, ...props.numeric, ...props.string, ...props.object];
    const existingProps = Object.getOwnPropertyNames(proto);
    flatProps.forEach(prop => {
        if (existingProps.includes(prop))
            return;
        const sym = Symbol();
        Object.defineProperty(proto, prop, {
            get() {
                return this[sym];
            },
            set(nv) {
                this[sym] = nv;
                this.onPropsChange(prop);
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
const propCategories = ['boolean', 'string', 'numeric', 'noReflect', 'notify', 'object', 'parsedObject'];
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
            }
            static get evalPath() {
                return lispToCamel(this.is);
            }
            static get observedAttributes() {
                const props = this.props;
                return [...props.boolean, ...props.numeric, ...props.string, ...props.parsedObject].map(s => camelToLisp(s));
            }
            static mergeProps(props1, props2) {
                const returnObj = {};
                propCategories.forEach(propCat => {
                    returnObj[propCat] = [...props1[propCat], ...props2[propCat]];
                });
                return returnObj;
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
            onPropsChange(name) { }
            attributeChangedCallback(n, ov, nv) {
                const propName = lispToCamel(n);
                const anyT = this;
                const ep = this.constructor.evaluatedProps;
                if (ep.string.includes(propName)) {
                    anyT[propName] = nv;
                }
                else if (ep.boolean.includes(propName)) {
                    anyT[propName] = nv !== null;
                }
                else if (ep.numeric.includes(propName)) {
                    anyT[propName] = parseFloat(nv);
                }
                else if (ep.parsedObject.includes(propName)) {
                    anyT[propName] = JSON.parse(nv);
                }
                this.onPropsChange(propName);
            }
            connectedCallback() {
                const ep = this.constructor.evaluatedProps;
                this.propUp([...ep.boolean, ...ep.string, ...ep.numeric, ...ep.object]);
                this._connected = true;
                this.onPropsChange(disabled);
            }
            /**
             * Dispatch Custom Event
             * @param name Name of event to dispatch ("-changed" will be appended if asIs is false)
             * @param detail Information to be passed with the event
             * @param asIs If true, don't append event name with '-changed'
             */
            de(name, detail, asIs = false, noBubble = false) {
                const eventName = name + (asIs ? '' : '-changed');
                const newEvent = new CustomEvent(eventName, {
                    detail: detail,
                    bubbles: noBubble,
                    composed: false,
                    cancelable: true,
                });
                this.dispatchEvent(newEvent);
                this.incAttr(eventName);
                return newEvent;
            }
        },
        _a.attributeProps = ({ disabled }) => ({
            boolean: [disabled],
        }),
        _a;
}
