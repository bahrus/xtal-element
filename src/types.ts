import {Action, LogicOp, LogicOpProp, PropInfo, WCConfig} from 'trans-render/lib/types';


export interface DeclarativeBinder<MCProps = any, MCActions = MCProps> extends Action<MCProps>{
     preAction?: keyof MCActions;
     arg?: any;
}

export type OpOptions = 'and' | 'or' | 'nand' | 'nor' | 'eq';

export interface IFormat<MCProps = any>{
     key: keyof MCProps,
     locale?: string,
     localeOptions?: any,
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


export interface ISetTo<MCProps = any>{
     key: string,
     val: any,
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
     customState?: string | ICustomState<MCProps>
}

export interface ICustomState<MCProps = any>{
     truthy?: string,
     falsy?: string,
     nameValue?: string
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

export interface PropInfoExt<MCProps = any, MCActions = MCProps> extends PropInfo{

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

export interface DefineArgs<MixinCompositeProps = any, MixinCompositeActions = MixinCompositeProps, TPropInfo = PropInfoExt<MixinCompositeProps, MixinCompositeActions>, TAction extends Action = Action<MixinCompositeProps>>{
     superclass?: {new(): any} | string,
     mixins?: any[],
     mainTemplate?: HTMLTemplateElement;
     /** use this only for defaults that can't be JSON serialized in config */
     complexPropDefaults?: Partial<MixinCompositeProps>;
     /** Config should be 100% JSON serializable */
     config: WCConfig<MixinCompositeProps, MixinCompositeActions, TPropInfo, TAction>;
     
 }

