import {Action, LogicOp, LogicOpProp, PropInfo} from 'trans-render/lib/types.js';

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

export type OpOptions = 'and' | 'or' | 'nand' | 'nor' | 'eq';

export interface PropInfoExt<MCProps = any> extends PropInfo{
     notify?: {
          dispatch?: boolean,
          echoTo?: keyof MCProps,
          echoDelay?: number | (keyof MCProps),
          toggleTo?: keyof MCProps,
          /**
          * Reflect property changes to data-*
          */
          reflect?: boolean; 
      },
     
     /**
     * Delete this property after the specified number of milliseconds. 
     */
     transience?: number;

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

}

