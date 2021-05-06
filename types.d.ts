import { X } from './lib/X.js';
import {IHydrate} from 'trans-render/types.d.js';
export {RenderContext, IHydrate, Plugins, Plugin, RenderOptions, TransformMatch, NextStep, TransformValueOptions, TransformValueObjectOptions, TransformValueArrayOptions, PropSettings, EventSettings, AttribsSettings, PSettings, PESettings, PEUnionSettings, PEASettings, PEAUnionSettings, PEATSettings, PEAT$ettings, PEATUnionSettings, ArraySlot, Range, InitTransform, UpdateTransform, MetaSettings, TemplateOrTag, TemplateTagGetter, ToTOrFnToTot, AT, ATR, ATRI, ATRIU, ATRIUM, ATRIUM_Loop, PlugInArgs, MetaInstructions, CAT, CATMI, CATMINT, CATMINT_Conditional, InsOrRep, Na, Nap, Nappe, NappeUnion, EvaluatedAttributeProps} from 'trans-render/types.d.js';
export type PropAction<T extends Element = HTMLElement> = (t: T) => any;

export interface XConfig{
    mainTemplate: HTMLTemplateElement;
    propActions: PropAction[];
    propDefs?: PropDefMap<any>;
    noShadow?: boolean;
    name: string;
    class?: {new(): X};
    refs: any;
}
//TODO look into variadic tuple types
export type EventScopeT = [string | undefined];
export type EventScopeTB = [string | undefined, 'bubbles' | undefined];
export type EventScopeTBC = [string | undefined, 'bubbles' | undefined, 'cancelable' | undefined];
export type EventScopeTBCCo = [string | undefined, 'bubbles' | undefined, 'cancelable' | undefined, 'composed' | undefined];
export type EventScope = EventScopeT | EventScopeTB | EventScopeTBC | EventScopeTBCCo;


export type EventScopes = EventScope[];


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
     * Block reactions containing this property if property is truthy
     */
    stopReactionsIfTruthy?: boolean;

    /**
     * Block notification if property is falsey
     */
    stopNotificationIfFalsy?: boolean;
    /**
     * Copy property value to another value specified by echoTo
     */
    echoTo?: string;

    /**
     * Make property read-easily, write obscureky
     */
    obfuscate?: boolean;

    /**
     * Alias for obfuscated properties
     */
    alias?: string;

    /**
     * Delete this property after the specified number of milliseconds. 
     */
    transience?: number;

    /**
     * Do not trigger any reactions, but merge this object into the custom element instance using object.assign.
     * This is useful for client-side hydrating of already server-side-rendered content.
     */
    syncProps?: any;

    /**
     * Provide a default value (if using the hydrate function) *only if* this attribute is not present.
     * If the attrib is present, the assumption is that the property will be set externally, and the default value thrown away,
     * so this avoids wasted effort involed in setting the initial value.
     */
    byoAttrib?: string;

    /**
     * Make a deep copy of objects that are passed in.
     */
    clone?:  boolean;
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
    deferHydration?: boolean;
    suspendRx?: boolean;
    propActions: PropAction[];
    propActionsHub?(propAction: PropAction): void;
    reactor?: IReactor;
}

export interface IReactor{
    addToQueue(prop: PropDef, newVal: any, ignoreList?: string[]): void;
    requestUpdate?: boolean;
    subscribe(propsOfInterest: Set<string>, callBack: (rs: ReactiveSurface) => void): void;
    unsubscribe(propsOfInterest: Set<string>, callBack: (rs: ReactiveSurface) => void): void;
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

export interface IInternals {
    _internals: any;
}


export interface XtalPattern extends ReactiveSurface{
    domCache: any,
    mainTemplate: HTMLTemplateElement;
    styleTemplate?: HTMLTemplateElement | undefined;
    clonedTemplate: DocumentFragment | undefined;
    refs: any;
    self: this,
    beReflective?: string[] | undefined;
    handlersAttached?: boolean | undefined;
}

export interface PSDo{
    do(refs: any, dependencies: string[] | undefined, reactor: IReactor): void;
}




