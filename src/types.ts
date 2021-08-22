import {Action, LogicOp, LogicOpProp} from 'trans-render/lib/types.js';

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

