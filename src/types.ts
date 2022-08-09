import {Action, LogicOp, LogicOpProp, PropInfo, WCConfig} from 'trans-render/lib/types';


export interface XAction<MCProps = any> extends Action<MCProps>{

     andAllOf?: LogicOpProp<MCProps>,
     orAllOf?: LogicOpProp<MCProps>,


     ifAtLeastOneOf?: LogicOpProp<MCProps>
     atLeastOneOf?: LogicOpProp<MCProps>,
     orAtLeastOneOf?: LogicOpProp<MCProps>,

     ifNoneOf?: LogicOpProp<MCProps>,
     andNoneOf?: LogicOpProp<MCProps>,
     orNoneOf?: LogicOpProp<MCProps>,
     
     ifEquals?: LogicOpProp<MCProps>,
     andIfEquals?: LogicOpProp<MCProps>,
     orIfEquals?: LogicOpProp<MCProps>,
}

export interface DeclarativeBinder<MCProps = any, MCActions = MCProps> extends XAction<MCProps>{
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
     by: number | (keyof MCProps),
}

export interface IMeasure<MCProps = any>{
     key: keyof MCProps,
}

export interface INotify<MCProps = any>{
     dispatch?: boolean,
     cloneTo?: keyof MCProps,
     echoTo?: keyof MCProps,
     echoDelay?: number | (keyof MCProps),
     toggleTo?: keyof MCProps,
     toggleDelay?: number | (keyof MCProps),
     /**
     * Reflect property changes to data-*
     */
     reflect?: {
          asAttr: boolean,
     }

     localeStringTo?: IFormat<MCProps>,

     parseTo?: IParse<MCProps>,

     incTo?: IInc<MCProps>,
     measureTo?: IMeasure<MCProps>,
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

export interface DefineArgs<MixinCompositeProps = any, MixinCompositeActions = MixinCompositeProps, TPropInfo = PropInfoExt<MixinCompositeProps, MixinCompositeActions>, TAction extends XAction = XAction<MixinCompositeProps>>{
     superclass?: {new(): any} | string,
     mixins?: any[],
     mainTemplate?: HTMLTemplateElement;
     /** use this only for defaults that can't be JSON serialized in config */
     complexPropDefaults?: Partial<MixinCompositeProps>;
     /** Config should be 100% JSON serializable */
     config: WCConfig<MixinCompositeProps, MixinCompositeActions, TPropInfo, TAction>;
     
 }

