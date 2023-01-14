import {CEArgs, IResolvableService, CEServiceClasses, CEServices} from 'trans-render/froop/types';
import {PropInfo} from 'trans-render/lib/types';


export interface INotifySvc extends IResolvableService{}

export interface XEServiceClasses extends CEServiceClasses{
    notify?: {new(args: XEArgs): INotifySvc},
}

export interface XEServices extends CEServices{
    notify?: INotifySvc
}

export interface XEArgs<TProps = any, TAciopns = TProps> extends CEArgs<TProps, TActions, PropInfoExt<TProps, TActions>> {
    servers?: XEServiceClasses,
    services?: XEServices,
}

export interface ICustomState<MCProps = any>{
    truthy?: string,
    falsy?: string,
    nameValue?: string
}

export interface IEchoTo<MCProps = any>{
    key: string,
    delay?: number | (keyof MCProps)
}

export interface IToggleTo<MCProps = any>{
    key: string,
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

export interface IFormat<MCProps = any>{
    key: keyof MCProps,
    locale: string,
    localeOptions: any,
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
    toggleTo?: string,
    /**
     * reflect ao attribute and/or custom state.
     */
    reflectTo?: string | IReflectTo<MCProps>
    /**
     * Stringify property to specified target property.
     */
    toStringTo?: (keyof MCProps & string),
    localeStringTo?: IFormat<MCProps>,

    parseTo?: IParse<MCProps>,

    incTo?: string | IInc<MCProps>,
    lengthTo?: string,
    toFormValue?: boolean,
    setTo?: ISetTo,
    mapTo?: IMapTo,
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