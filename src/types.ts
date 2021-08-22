import {Action, LogicOpProp} from 'trans-render/lib/types.js';

export interface XAction<MCProps = any> extends Action<MCProps>{

     andAllOf?: LogicOpProp<MCProps>,
     orAllOf?: LogicOpProp<MCProps>,
     ifAnyOf?: LogicOpProp<MCProps>,

     atLeastOneOf?: LogicOpProp<MCProps>,
     orAtLeastOneOf?: LogicOpProp<MCProps>
     ifNot?: LogicOpProp<MCProps>,
     andIfNot?: LogicOpProp<MCProps>,
     orIfNot?: LogicOpProp<MCProps>,
     ifEquals?: LogicOpProp<MCProps>,
     andIfEquals?: LogicOpProp<MCProps>,
     orIfEquals?: LogicOpProp<MCProps>,
}

