const stcRe = /(\-\w)/g;
export function lispToCamel(s) {
    return s.replace(stcRe, function (m) { return m[1].toUpperCase(); });
}
export function deconstruct(fn) {
    const fnString = fn.toString().trim();
    if (fnString.startsWith('({')) {
        const iPos = fnString.indexOf('})', 2);
        return fnString.substring(2, iPos).split(',').map(s => s.trim());
    }
    return [];
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
            }
            static get observedAttributes() {
                const props = this.evaluatedProps;
                return [...props.boolean, ...props.numeric, ...props.string, ...props.parsedObject];
            }
            static get evaluatedProps() {
                if (this.__evaluatedProps === undefined) {
                    const args = deconstruct(this.attributeProps);
                    const arg = {};
                    args.forEach(token => {
                        arg[token] = token;
                    });
                    this.__evaluatedProps = this.attributeProps(arg);
                    const ep = this.__evaluatedProps;
                    ep.boolean = ep.boolean || [];
                    ep.numeric = ep.numeric || [];
                    ep.parsedObject = ep.parsedObject || [];
                    ep.noReflect = ep.noReflect || [];
                    ep.notify = ep.notify || [];
                    ep.object = ep.object || [];
                    ep.string = ep.string || [];
                }
                return this.__evaluatedProps;
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
