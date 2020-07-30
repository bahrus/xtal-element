import { XtalElement } from './XtalElement.js';
import { X } from './X.js';
import {de} from './xtal-latx.js';
import {IHydrate} from 'trans-render/types.d.js';
export {TransformRules, PESettings, EvaluatedAttributeProps} from 'trans-render/types.d.js';
import {TransformRules, TransformValueOptions} from 'trans-render/types.d.js';
export type SelectiveUpdate<T extends XtalElement = XtalElement>  = (t: T) => TransformRules;
export type PropDefGet<T extends XtalElement = XtalElement> = (t: T) => AttributeProps;
export type TransformGetter<T extends XtalElement = XtalElement> = (t : T) => TransformValueOptions;
export type PropAction<T extends HTMLElement = HTMLElement> = (t: T) => void;

export interface AttributeProps{
    num?: any[];
    bool?: any[];
    str?: any[];
    obj?: any[];
    reflect?: any[];
    jsonProp?: any[];
    notify?: any[];
    dry?: any[];
    log?: any[];
    debug?: any[];
    async?: any[];
}

export interface tendArgs<T extends X = X>{
    name: string,
    class?: any,
    mixins?: any[],
    attributeProps: PropDefGet<T>,
    main: string,
    initTransform: TransformGetter<T>,
    updateTransforms?: SelectiveUpdate<T>[]
}
//TODO look into variadic tuple types
export type EventScopeT = [string];
export type EventScopeTB = [string, 'bubbles' | undefined];
export type EventScopeTBC = [string, 'bubbles' | undefined, 'cancelable' | undefined];
export type EventScopeTBCCo = [string, 'bubbles' | undefined, 'cancelable' | undefined, 'composed' | undefined];
export type EventScope = EventScopeT | EventScopeTB | EventScopeTBC | EventScopeTBCCo;


export type EventScopes = EventScope[];

export interface IXtallatXI extends IHydrate {

    /**
     * Dispatch Custom Event
     * @param name Name of event to dispatch ("-changed" will be appended if asIs is false)
     * @param detail Information to be passed with the event
     * @param asIs If true, don't append event name with '-changed'
     */
    [de](name: string, detail: any, asIs?: boolean): CustomEvent | void;
    /**
     * Needed for asynchronous loading
     * @param props Array of property names to "upgrade", without losing value set while element was Unknown
     */

     eventScopes: EventScopes | undefined;
 
    // static observedAttributes: string[]; 
}

export interface PropInfo{
    bool: boolean;
    str: boolean;
    num: boolean;
    reflect: boolean;
    notify: boolean;
    obj: boolean;
    jsonProp: boolean;
    dry: boolean;
    log: boolean;
    debug: boolean;
    async: boolean;
}





