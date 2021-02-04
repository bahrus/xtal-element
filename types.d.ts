import { XtalElement } from './legacy/XtalElement.js';
import { X } from './legacy/X.js';
import { X as newX} from './lib/X.js';
import {de} from './legacy/xtal-latx.js';
import {IHydrate} from 'trans-render/types.d.js';
export {RenderContext, IHydrate, Plugins, Plugin, RenderOptions, TransformMatch, NextStep, TransformValueOptions, TransformValueObjectOptions, TransformValueArrayOptions, PropSettings, EventSettings, AttribsSettings, PSettings, PESettings, PEUnionSettings, PEASettings, PEAUnionSettings, PEATSettings, PEAT$ettings, PEATUnionSettings, ArraySlot, Range, InitTransform, UpdateTransform, MetaSettings, TemplateOrTag, TemplateTagGetter, ToTOrFnToTot, AT, ATR, ATRI, ATRIU, ATRIUM, ATRIUM_Loop, PlugInArgs, MetaInstructions, CAT, CATMI, CATMINT, CATMINT_Conditional, InsOrRep, Na, Nap, Nappe, NappeUnion, EvaluatedAttributeProps} from 'trans-render/types.d.js';
export type PropAction<T extends Element = HTMLElement> = (t: T) => any;

export interface XConfig{
    mainTemplate: HTMLTemplateElement;
    propActions: PropAction[];
    propDefs?: PropDefMap<any>;
    noShadow?: boolean;
    name: string;
    class?: {new(): newX};
    refs: any;
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
    name: string;
}

export interface PropDef{
    /** Name of property */
    name?: string;
    /**
     * The type of the property.  If you don't want any support for attributes, use "Object" even if it is a number/string/boolean.
     */
    type?: Boolean | String | Number | Object;
    /**
     * Reflect property changes to data-*
     */
    reflect?: boolean;
    /**
     * Spawn non-bubbling custom event when property changes.  Name of event is [lisp-case-of-property-name]-changed.
     */
    notify?: boolean;
    /**
     * Parse corresponding (lisp-cased of property name) attribute as JSON string for Object type properties
     */
    parse?: boolean;
    /**
     * Don't do anything if new value is the same as the old value.
     */
    dry?: boolean;
    /**
     * Console.log when property changes
     */
    log?: boolean;
    /**
     * Insert debugger breakpoint when property changes
     */
    debug?: boolean;
    /**
     * React to property change asynchronously
     */
    async?: boolean;
    /**
     * Block reactions containing this property if property is falsey
     */
    stopReactionsIfFalsy?: boolean;

    /**
     * Block notification if property is falsey
     */
    stopNotificationIfFalsy?: boolean;
    /**
     * Copy property value to another value specified by echoTo
     */
    echoTo?: string;
}

export type PropDefMap<T> = {
    [P in keyof T]?: PropDef;
}

export interface SlicedPropDefs<T = any>{
    propDefs: PropDef[], 
    propNames: string[],
    strNames: string[],
    boolNames: string[],
    numNames: string[], 
    parseNames: string[], 
    ignoreList: string[],
    ignoreListOnce: string[] | undefined,
    propLookup: PropDefMap<T>,
}

//export type destructPropInfo<T = any> = (x: T) => PropDef | destructPropInfo<T>[];

export interface ReactiveSurface extends Partial<HTMLElement>{
    disabled?: boolean;
    propActions: PropAction[];
    propActionsHub?(propAction: PropAction): void;
}

export interface IReactor{
    addToQueue(prop: PropDef, newVal: any, ignoreList: string[]): void;
    requestUpdate?: boolean;
}

interface ProcessorCtor {
    ctor: {new(): PSDo} | PSDo;
}

export interface LHSProcessorCtor extends ProcessorCtor {
    lhsType: any;
}

export interface RHSProcessorCtor extends ProcessorCtor {
    rhsType: any;
}

export interface BothProcessor {
    lhsType: any;
    rhsType: any;
}

interface BothProcessorCtor extends ProcessorCtor, BothProcessor {}

export type ProcessorMap = LHSProcessorCtor | RHSProcessorCtor | BothProcessorCtor;


export interface XtalPattern extends ReactiveSurface{
    domCache: any,
    mainTemplate: HTMLTemplateElement;
    clonedTemplate: DocumentFragment | undefined;
    refs: any;
    self: this,
    beReflective?: string[] | undefined;
    handlersAttached?: boolean | undefined;
}

export interface PSDo{
    do(refs: any, dependencies: string[] | undefined, reactor: IReactor): void;
}




