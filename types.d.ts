import { XtalElement } from './XtalElement.js';
import { X } from './X.js';
import {de} from './xtal-latx.js';
import {IHydrate} from 'trans-render/types.d.js';
export {RenderContext, IHydrate, Plugins, Plugin, RenderOptions, TransformMatch, NextStep, TransformValueOptions, TransformValueObjectOptions, TransformValueArrayOptions, PropSettings, EventSettings, AttribsSettings, PSettings, PESettings, PEASettings, PEAUnionSettings, PEATSettings, PEAT$ettings, PEATUnionSettings, ArraySlot, Range, InitTransform, UpdateTransform, MetaSettings, TemplateOrTag, TemplateTagGetter, ToTOrFnToTot, AT, ATR, ATRI, ATRIU, ATRIUM, ATRIUM_Loop, PlugInArgs, MetaInstructions, CAT, CATMI, CATMINT, CATMINT_Conditional, InsOrRep, Na, Nap, Nappe, NappeUnion, EvaluatedAttributeProps} from 'trans-render/types.d.js';
import {TransformValueOptions} from 'trans-render/types.d.js';
export type SelectiveUpdate<T extends XtalElement = XtalElement>  = (t: T) => TransformValueOptions;
export type PropDefGet<T extends XtalElement = XtalElement> = (t: T) => AttributeProps;
export type TransformGetter<T extends XtalElement = XtalElement> = (t : T) => TransformValueOptions | TransformValueOptions[];
export type PropAction<T extends Element = HTMLElement> = (t: T) => void;

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
export type EventScopeT = [string | undefined];
export type EventScopeTB = [string | undefined, 'bubbles' | undefined];
export type EventScopeTBC = [string | undefined, 'bubbles' | undefined, 'cancelable' | undefined];
export type EventScopeTBCCo = [string | undefined, 'bubbles' | undefined, 'cancelable' | undefined, 'composed' | undefined];
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






