import { disabled } from 'trans-render/hydrate.js';
const stcRe = /(\-\w)/g;
export function lispToCamel(s) {
    return s.replace(stcRe, function (m) { return m[1].toUpperCase(); });
}
/**
 * Base class for many xtal- components
 * @param superClass
 */
export function XtallatX(superClass) {
    return class extends superClass {
        constructor() {
            super(...arguments);
            /**
             * Tracks how many times each event type was called.
             */
            this.evCount = {};
        }
        static get observedAttributes() { return [disabled]; }
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
    };
}
