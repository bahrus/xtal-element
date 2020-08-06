import {IHydrate} from 'trans-render/types.d.js';
import {EvaluatedAttributeProps, AttributeProps, PropAction, IXtallatXI, EventScopes, PropInfo} from './types.d.js';
import {debounce} from './debounce.js';
export * from './types.d.js';
export {hydrate} from 'trans-render/hydrate.js';

type Constructor<T = {}> = new (...args: any[]) => T;
/**
 * Base class for many xtal- components
 * @param superClass
 */
export function XtallatX<TBase extends Constructor<IHydrate>>(superClass: TBase) {
    return class extends superClass implements IXtallatXI {

        /**
         * @private
         */
        static get evalPath(){
            return lispToCamel((<any>this).is);
        }
        /**
         * @private
         */
        static get observedAttributes(){
            const props = this.props;
            return [...props.bool, ...props.num, ...props.str, ...props.jsonProp].map(s => camelToLisp(s));
        }

        /**
         * @private
         * @param param0 
         */
        static attributeProps : any = ({disabled } : IXtallatXI) => ({
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
        __evCount: { [key: string]: number } = {}; 
        /**
         * Turn number into string with even and odd values easy to query via css.
         * @param n 
         */
        __to$(n: number) { //TODO:  https://github.com/denoland/deno/issues/5258
            const mod = n % 2;
            return (n - mod) / 2 + '-' + mod;
        }
        /**
         * Increment event count
         * @param name
         */
        __incAttr(name: string) { //TODO:  https://github.com/denoland/deno/issues/5258
            const ec = this.__evCount;
            if (name in ec) {
                ec[name]++;
            } else {
                ec[name] = 0;
            }
            this.attr('data-' + name, this.__to$(ec[name]));
        }
        onPropsChange(name: string | string[]) {
            let isAsync = false;
            const propInfoLookup = (<any>this.constructor)[propInfoSym] as {[key: string]: PropInfo};
            if(Array.isArray(name)){
                name.forEach(subName => {
                    this.__propActionQueue.add(subName);
                    const propInfo = propInfoLookup[subName];
                    if(propInfo !== undefined && propInfo.async) isAsync = true;
                });
            }else{
                this.__propActionQueue.add(name);
                const propInfo = propInfoLookup[name];
                if(propInfo !== undefined && propInfo.async) isAsync = true;
            }
            if(this.disabled || !this._xlConnected){
                return;
            };
            if(isAsync){
                this.__processActionDebouncer();
            }else{
                this.__processActionQueue();
            }
            
        }
        attributeChangedCallback(n: string, ov: string, nv: string) {
            (<any>this)[atrInit] = true; // track each attribute?
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

        /**
         * @private
         */
        self = this;
        

        _xlConnected = false;
        connectedCallback(){
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
        [de](name: string, detail: any, asIs: boolean = false) {
            if(this.disabled) return;
            const eventName = name + (asIs ? '' : '-changed');
            let bubbles = false;
            let composed = false;
            let cancelable = false;
            if(this.eventScopes !== undefined){
                const eventScope = this.eventScopes.find(x => (x[0] === undefined) || x[0].startsWith(eventName));
                if(eventScope !== undefined){
                    bubbles = eventScope[1] === 'bubbles';
                    cancelable = eventScope[2] === 'cancelable';
                    composed = eventScope[3] === 'composed';
                }
            } 
            const newEvent = new CustomEvent(eventName, {
                detail: detail,
                bubbles: bubbles,
                composed: composed,
                cancelable: cancelable, //https://dev.to/open-wc/composed-true-considered-harmful-5g59
            } as CustomEventInit);
            this.dispatchEvent(newEvent);
            this.__incAttr(eventName);
            return newEvent;
        }

        /**
         * Allow instances of component to specify custom event propagation (EventInit) parameters
         * @private
         */
        eventScopes: EventScopes | undefined;

        ___processActionDebouncer!: any;
        get __processActionDebouncer(){ //TODO:  https://github.com/denoland/deno/issues/5258
            if(this.___processActionDebouncer === undefined){
                this.___processActionDebouncer = debounce((getNew: boolean = false) => {
                    this.__processActionQueue();
                }, 16);
            }
            return this.___processActionDebouncer;
        }

        __propActionQueue: Set<string> = new Set(); 

        propActions: PropAction<this>[] | undefined;

        __processActionQueue(){ //TODO:  https://github.com/denoland/deno/issues/5258
            if(this.propActions === undefined) return;
            const queue = this.__propActionQueue;
            this.__propActionQueue = new Set();
            this.propActions.forEach(propAction =>{
                const dependencies = deconstruct(propAction as Function);
                const dependencySet = new Set<string>(dependencies);
                if(intersection(queue, dependencySet).size > 0){
                    propAction(this);
                }
            });
        }

    }
}

//utility fns




const ignorePropKey = Symbol();
const ignoreAttrKey = Symbol();

const propInfoSym = Symbol('propInfo');
const atrInit = Symbol('atrInit');
export function define(MyElementClass: any){
    const tagName = MyElementClass.is as string;
    let n = 0;
    let foundIt = false;
    let isNew = false;
    let name = tagName;
    do{
        if(n > 0) name = `${tagName}-${n}`;
        const test = customElements.get(name);
        if(test !== undefined){
            if(test === MyElementClass){
                foundIt = true; //all good;
                MyElementClass.isReally = name;
            }else{
                //do nothing, which will cause next name to be tested
            }
        }else{
            isNew = true;
            MyElementClass.isReally = name;
            foundIt = true;
        }
        n++;
    }while(!foundIt);
    if(!isNew) return;
    const props = MyElementClass.props as EvaluatedAttributeProps;
    const proto = MyElementClass.prototype;
    const flatProps = [...props.bool, ...props.num, ...props.str, ...props.obj];
    const existingProps = Object.getOwnPropertyNames(proto);
    
    MyElementClass[propInfoSym] = {};
    flatProps.forEach(prop =>{
        if(existingProps.includes(prop)) return;
        const sym = Symbol(prop);
        const propInfo = {} as any;
        propCategories.forEach(cat =>{
            propInfo[cat] = props[cat]!.includes(prop);
        })
        MyElementClass[propInfoSym][prop] = propInfo;
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
                const propInfo = MyElementClass[propInfoSym][prop] as PropInfo;
                if(propInfo.dry){
                    if(nv === this[sym]) return;
                }
                const c2l = camelToLisp(prop);
                if(propInfo.reflect){
                    //experimental line -- we want the attribute to take precedence over default value.
                    if(this[atrInit] === undefined && this.hasAttribute(c2l)) return;
                    if(this[ignoreAttrKey] === undefined) this[ignoreAttrKey] = {};
                    this[ignoreAttrKey][c2l] = true;
                    if(propInfo.bool){
                        this.attr(c2l, nv, '');
                    }else if(propInfo.str){
                        this.attr(c2l, nv);
                    }else if(propInfo.num){
                        this.attr(c2l, nv.toString());
                    }else if(propInfo.obj){
                        this.attr(c2l, JSON.stringify(nv));
                    }
                }
                this[sym] = nv;
                if(propInfo.log){
                    console.log(propInfo, nv);
                }
                if(propInfo.debug) debugger;
                this.onPropsChange(prop);
                if(propInfo.notify){
                    this[de](c2l, {value: nv});
                }
            },
        });
    })
    customElements.define(name, MyElementClass);

}


export const de: unique symbol = Symbol.for('1f462044-3fe5-4fa8-9d26-c4165be15551');




export function mergeProps(props1: EvaluatedAttributeProps | AttributeProps, props2: EvaluatedAttributeProps | AttributeProps): EvaluatedAttributeProps{
    const returnObj: Partial<EvaluatedAttributeProps> = {};
    propCategories.forEach(propCat =>{
        returnObj[propCat] = (props1[propCat] || []).concat(props2[propCat] || []);
    })
    return returnObj as EvaluatedAttributeProps;
}

//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set
export function intersection<T = string>(setA: Set<T>, setB: Set<T>) {
    let _intersection = new Set()
    for (let elem of setB) {
        if (setA.has(elem)) {
            _intersection.add(elem)
        }
    }
    return _intersection
}

const ltcRe = /(\-\w)/g;
export function lispToCamel(s: string){
    return s.replace(ltcRe, function(m){return m[1].toUpperCase();});
}

const ctlRe = /[\w]([A-Z])/g;
export function camelToLisp(s: string) {
    return s.replace(ctlRe, function(m) {
        return m[0] + "-" + m[1];
    }).toLowerCase();
}

export const p = Symbol('placeholder');
export function symbolize(obj: any){
    for(var key in obj){
        obj[key] = Symbol(key);
    }
}

type keys = keyof EvaluatedAttributeProps;
const propCategories : keys[] = ['bool', 'str', 'num', 'reflect', 'notify', 'obj', 'jsonProp', 'dry', 'log', 'debug', 'async'];
const argList = Symbol('argList');
export function deconstruct(fn: Function){
    if((<any>fn)[argList] === undefined){
        const fnString = fn.toString().trim();
        if(fnString.startsWith('({')){
            const iPos = fnString.indexOf('})', 2);
            (<any>fn)[argList] = fnString.substring(2, iPos).split(',').map(s => s.trim());
        }else{
            (<any>fn)[argList] = []
        }
        
    }
    return (<any>fn)[argList]! as string[];

}