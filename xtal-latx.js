const evCount = Symbol('evCount');
const to$ = Symbol('to$');
export const incAttr = Symbol('incAttr');
/**
 * Base class for many xtal- components
 * @param superClass
 */
export function XtallatX(superClass) {
    var _a;
    return class extends superClass {
        constructor() {
            super(...arguments);
            this[_a] = {};
        }
        static get observedAttributes() { return []; }
        /**
         * Turn number into string with even and odd values easy to query via css.
         * @param n
         */
        [(_a = evCount, to$)](n) {
            const mod = n % 2;
            return (n - mod) / 2 + '-' + mod;
        }
        /**
         * Increment event count
         * @param name
         */
        [incAttr](name) {
            const ec = this[evCount];
            if (name in ec) {
                ec[name]++;
            }
            else {
                ec[name] = 0;
            }
            this.attr('data-' + name, this[to$](ec[name]));
        }
        /**
         * Dispatch Custom Event
         * @param name Name of event to dispatch ("-changed" will be appended if asIs is false)
         * @param detail Information to be passed with the event
         * @param asIs If true, don't append event name with '-changed'
         */
        de(name, detail, asIs = false) {
            const eventName = name + (asIs ? '' : '-changed');
            const newEvent = new CustomEvent(eventName, {
                detail: detail,
                bubbles: true,
                composed: false,
            });
            this.dispatchEvent(newEvent);
            this[incAttr](eventName);
            return newEvent;
        }
    };
}
