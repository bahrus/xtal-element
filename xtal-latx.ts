import {hydrate, disabled} from 'trans-render/hydrate.js';
import {IHydrate} from 'trans-render/types.d.js';
import {EvaluatedAttributeProps, AttributeProps} from './types.d.js';

const ltcRe = /(\-\w)/g;
export function lispToCamel(s: string){
    return s.replace(ltcRe, function(m){return m[1].toUpperCase();});
}

const ctlRe = /[\w]([A-Z])/g;
function camelToLisp(s: string) {
       return s.replace(ctlRe, function(m) {
           return m[0] + "-" + m[1];
       }).toLowerCase();
   }


export function deconstruct(fn: Function){
    const fnString = fn.toString().trim();
    if(fnString.startsWith('({')){
        const iPos = fnString.indexOf('})', 2);
        return fnString.substring(2, iPos).split(',').map(s => s.trim());
    }
    return [];
}

const ignorePropKey = Symbol();
const ignoreAttrKey = Symbol();
export function define(MyElementClass: any){
    const props = MyElementClass.props as EvaluatedAttributeProps;
    const proto = MyElementClass.prototype;
    const flatProps = [...props.bool, ...props.num, ...props.str, ...props.obj];
    const existingProps = Object.getOwnPropertyNames(proto);
    flatProps.forEach(prop =>{
        if(existingProps.includes(prop)) return;
        const sym = Symbol();
        Object.defineProperty(proto, prop, {
            get(){
                return this[sym];
            },
            set(nv){
                const ik = this[ignorePropKey];
                if(ik !== undefined && ik[prop] === true){
                    delete ik[prop];
                    this[sym] = nv;
                    return;
                }
                if(props.reflect.includes(prop)){
                    const c2l = camelToLisp(prop);
                    
                    if(this[ignoreAttrKey] === undefined) this[ignoreAttrKey] = {};
                    this[ignoreAttrKey][c2l] = true;
                    if(props.bool.includes(prop)){
                        this.attr(c2l, nv, '');
                    }else if(props.str.includes(prop)){
                        this.attr(c2l, nv);
                    }else if(props.num.includes(prop)){
                        this.attr(c2l, nv.toString());
                    }else if(props.obj.includes(prop)){
                        this.attr(c2l, JSON.stringify(nv));
                    }
                }
                this[sym] = nv;
                this.onPropsChange(prop);

            },
        });
    })
    const tagName = MyElementClass.is as string;
    if(customElements.get(tagName)){
        console.warn('Already registered ' + tagName);
        return;
    }
    customElements.define(tagName, MyElementClass);
}

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
type keys = keyof EvaluatedAttributeProps;
const propCategories : keys[] = ['boolean', 'string', 'numeric', 'reflect', 'notify', 'object', 'parsedObject'];

export function mergeProps(props1: EvaluatedAttributeProps | AttributeProps, props2: EvaluatedAttributeProps | AttributeProps): EvaluatedAttributeProps{
    const returnObj: Partial<EvaluatedAttributeProps> = {};
    propCategories.forEach(propCat =>{
        returnObj[propCat] = (props1[propCat] || []).concat(props2[propCat] || []);
    })
    return returnObj as EvaluatedAttributeProps;
}

type Constructor<T = {}> = new (...args: any[]) => T;
/**
 * Base class for many xtal- components
 * @param superClass
 */
export function XtallatX<TBase extends Constructor<IHydrate>>(superClass: TBase) {
    return class extends superClass implements IXtallatXI {

        static get evalPath(){
            return lispToCamel((<any>this).is);
        }
        static get observedAttributes(){
            const props = this.props;
            return [...props.bool, ...props.num, ...props.str, ...props.jsonProp].map(s => camelToLisp(s));
        }

        static attributeProps : any = ({disabled} : IXtallatXI) => ({
            bool: [disabled],
        } as AttributeProps);



        static get props(){
            if((<any>this)[this.evalPath] === undefined){
                const args = deconstruct(this.attributeProps);
                const arg: {[key: string]: string} = {};
                args.forEach(token => {
                    arg[token] = token;
                });
                (<any>this)[this.evalPath] = (<any>this.attributeProps)(arg);
                const ep = (<any>this)[this.evalPath];
                propCategories.forEach(propCat =>{
                    ep[propCat] = ep[propCat] || [];
                })
            }
            return (<any>this)[this.evalPath] as EvaluatedAttributeProps;
        }
        /**
         * Tracks how many times each event type was called.
         */
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
        onPropsChange(name: string){}
        attributeChangedCallback(n: string, ov: string, nv: string) {
            const ik = (<any>this)[ignoreAttrKey];
            if(ik !== undefined && ik[n] === true){
                delete ik[n];
                return;
            }
            const propName = lispToCamel(n);
            if((<any>this)[ignorePropKey] === undefined) (<any>this)[ignorePropKey] = {};
            (<any>this)[ignorePropKey][propName] = true;
            const anyT = this as any;
            const ep = (<any>this.constructor).props as EvaluatedAttributeProps;
            if(ep.str.includes(propName)){
                anyT[propName] = nv;
            }else if(ep.bool.includes(propName)){
                anyT[propName] = nv !== null;
            }else if(ep.num.includes(propName)){
                anyT[propName] = parseFloat(nv);
            }else if(ep.jsonProp.includes(propName)){
                try{
                    anyT[propName] = JSON.parse(nv);
                }catch(e){
                    anyT[propName] = nv;
                }
                
            }
        
            this.onPropsChange(propName);
        }

        _connected!: boolean;
        connectedCallback(){
            const ep = (<any>this.constructor).props as EvaluatedAttributeProps;
            this.propUp([...ep.bool, ...ep.str, ...ep.num, ...ep.obj]);
            this._connected = true;
            this.onPropsChange(disabled);
        }

        /**
         * Dispatch Custom Event
         * @param name Name of event to dispatch ("-changed" will be appended if asIs is false)
         * @param detail Information to be passed with the event
         * @param asIs If true, don't append event name with '-changed'
         */
        de(name: string, detail: any, asIs: boolean = false, noBubble: boolean = false) {
            const eventName = name + (asIs ? '' : '-changed');
            const newEvent = new CustomEvent(eventName, {
                detail: detail,
                bubbles: noBubble,
                composed: false,
                cancelable: true, //https://dev.to/open-wc/composed-true-considered-harmful-5g59
            } as CustomEventInit);
            this.dispatchEvent(newEvent);
            this.incAttr(eventName);
            return newEvent;
        }


    }
}