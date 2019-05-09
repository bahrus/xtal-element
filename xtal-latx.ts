import {hydrate, IHydrate, disabled} from 'trans-render/hydrate.js';
//const evCount = Symbol('evCount');
//const to$ = Symbol('to$');
//export const incAttr = Symbol('incAttr');
export interface IXtallatXI extends IHydrate {

    /**
     * Dispatch Custom Event
     * @param name Name of event to dispatch ("-changed" will be appended if asIs is false)
     * @param detail Information to be passed with the event
     * @param asIs If true, don't append event name with '-changed'
     */
    de(name: string, detail: any, asIs?: boolean): CustomEvent;
    /**
     * Needed for asynchronous loading
     * @param props Array of property names to "upgrade", without losing value set while element was Unknown
     */
 
    // static observedAttributes: string[]; 
}
type Constructor<T = {}> = new (...args: any[]) => T;
/**
 * Base class for many xtal- components
 * @param superClass
 */
export function XtallatX<TBase extends Constructor<IHydrate>>(superClass: TBase) {
    return class extends superClass implements IXtallatXI {

        static get observedAttributes(){return [disabled];}
        evCount: { [key: string]: number } = {};
        /**
         * Turn number into string with even and odd values easy to query via css.
         * @param n 
         */
        to$(n: number) {
            const mod = n % 2;
            return (n - mod) / 2 + '-' + mod;
        }
        /**
         * Increment event count
         * @param name
         */
        incAttr(name: string) {
            const ec = this.evCount;
            if (name in ec) {
                ec[name]++;
            } else {
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
        de(name: string, detail: any, asIs: boolean = false) {
            const eventName = name + (asIs ? '' : '-changed');
            const newEvent = new CustomEvent(eventName, {
                detail: detail,
                bubbles: true,
                composed: false,
            } as CustomEventInit);
            this.dispatchEvent(newEvent);
            this.incAttr(eventName);
            return newEvent;
        }


    }
}