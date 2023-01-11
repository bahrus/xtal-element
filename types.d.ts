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

export interface INotify<MCProps = any>{
    dispatch?: boolean,
    cloneTo?: keyof MCProps,
    echoTo?: (keyof MCProps & string) | IEchoTo<MCProps>,
    negateTo?: (keyof MCProps & string) | IToggleTo<MCProps>,
    toggleTo?: string,
    reflectTo?: string | IReflectTo<MCProps>

    localeStringTo?: IFormat<MCProps>,

    parseTo?: IParse<MCProps>,

    incTo?: string | IInc<MCProps>,
    lengthTo?: string,
    toFormValue?: boolean,
    setTo?: ISetTo
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