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




export interface ISetTo<MCProps = any>{
     key: string,
     val: any,
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

