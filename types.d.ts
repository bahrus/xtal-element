import {CEArgs, IResolvableService, CEServiceClasses, CEServices} from 'trans-render/froop/types';
import {PropInfo, Scope, WCConfig} from 'trans-render/lib/types';
import { XForm } from 'trans-render/types';


export interface INotifySvc extends IResolvableService{}

export interface XEServiceClasses extends CEServiceClasses{
    notify?: {new(args: XEArgs): INotifySvc},
}

export interface XEServices extends CEServices{
    notify?: INotifySvc
}

export interface XEArgs<TProps = any, TActions = TProps> extends CEArgs<TProps, TActions, PropInfoExt<TProps, TActions>> {
    servers?: XEServiceClasses,
    services?: XEServices,
}

export interface Config<TProps=any, TActions = TProps> extends WCConfig<TProps, TActions, PropInfoExt<TProps, TActions>>{}

export interface ICustomState<MCProps = any>{
    truthy?: string,
    falsy?: string,
    nameValue?: string
}

export interface IEchoTo<MCProps = any>{
    key: keyof MCProps & string,
    delay?: number | (keyof MCProps)
}

export interface IToggleTo<MCProps = any>{
    key: keyof MCProps & string,
    delay?: number | (keyof MCProps)
}

export interface ISetTo<MCProps = any>{
    key: keyof MCProps & string,
    val: any,
    delay?: number | (keyof MCProps)
}

export interface IReflectTo<MCProps = any>{
    attr?: boolean,
    customState?: string | ICustomState<MCProps>,
    aria?: string,
}

export interface IParse<MCProps = any>{
    key: keyof MCProps,
    as: 'number' | 'date' | 'obj'
}

export interface IInc<MCProps = any>{
    key: keyof MCProps,
    step?: number | (keyof MCProps),
    ltOrEq?: number | (keyof MCProps),
    lt?: number | (keyof MCProps),
    min?: number | (keyof MCProps),
    loop?: boolean | (keyof MCProps),
    notifyWhenMax?: INotify<MCProps>
}

export interface ILocale<MCProps = any>{
    key: keyof MCProps,
    locale: string,
    localeOptions: any,
}

export interface IWrapTo<MCProps = any>{
    key: keyof MCProps,
    lhs?: string,
    rhs?: string
}

export interface IMapTo<MCProps = any>{
    key: keyof MCProps,
    map: [match: any, val: any][]
}

export interface INotify<MCProps = any>{
    /**
     * dispatch an event with property value changes
     */
    dispatch?: boolean,
    /**
     * dispatch event from enhanced element with element enhancements
     */
    dispatchFromEnhancedElement?: boolean,
    /**
     * clone a copy of the property value to another property when it changes
     */
    cloneTo?: keyof MCProps,
    /**
     * echo the value to specified target property
     */
    echoTo?: (keyof MCProps & string) | IEchoTo<MCProps>,
    /**
     * set the opposite value when (boolean) property changes
     */
    negateTo?: (keyof MCProps & string) | IToggleTo<MCProps>,
    /**
     * toggle another property value whenever this property changes
     */
    toggleTo?: string | IToggleTo<MCProps>,
    /**
     * reflect as attribute and/or custom state.
     */
    reflectTo?: string | IReflectTo<MCProps>
    /**
     * Stringify property to specified target property.
     */
    toStringTo?: (keyof MCProps & string),
    localeStringTo?: ILocale<MCProps>,

    parseTo?: IParse<MCProps>,

    incTo?: string | IInc<MCProps>,
    lengthTo?: string,
    toFormValue?: boolean,
    setTo?: ISetTo,
    mapTo?: IMapTo | IMapTo[],
    wrapTo?: IWrapTo,
}

export interface PropInfoExt<MCProps = any, MCActions = MCProps> extends PropInfo {

    notify?: INotify<MCProps>;

    /**
    * Console.log when property changes
    */
   log?: boolean;
   /**
    * Insert debugger breakpoint when property changes
    */
   debug?: boolean;

    /**
    * Provide a default value (if using the hydrate function) *only if* this attribute is not present.
    * If the attrib is present, the assumption is that the property will be set externally, and the default value thrown away,
    * so this avoids wasted effort involved in setting the initial value.
    */
    byoAttrib?: string;

    //updatedBy?: Partial<{[key in keyof MCActions]: DeclarativeBinder<MCProps, MCActions>}>[];

}

export interface PropInferenceCriteria{
    cssSelector: string,
    attrForProp: string,

}

export interface XtalElementEndUserProps<MCProps = any, MCActions = MCProps>{
    aka?: string,
    shadowRootMode?: ShadowRootMode,
    propDefaults?: Partial<MCProps & MCActions>,
    propInfo?: {[key: keyof MCProps & string]: PropInfoExt<MCProps, MCActions>},
    xform?: XForm<MCProps, MCActions>,
    inferProps?: boolean,
    propInferenceCriteria?: Array<PropInferenceCriteria>,
    targetScope?: Scope,
    
}

export interface XtalElementAllProps<MCProps = any, MCActions = MCProps> extends XtalElementEndUserProps<MCProps, MCActions>{
    isAttrParsed?: boolean,
    isPropDefaulted?: boolean,
    mainTemplate?: HTMLTemplateElement,
    inferredPropXForm?: XForm<MCProps, MCActions>,
    resolved?: boolean
}

export type ProAP = Promise<Partial<XtalElementAllProps>>;

export interface XtalElementActions{
    getTemplate(self: this): ProAP,
    define(self: this): ProAP
}