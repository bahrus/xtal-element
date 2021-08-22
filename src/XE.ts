import {CE, PropInfo} from 'trans-render/lib/CE.js';
import {ListOfLogicalExpressions, LogicOp, LogicEvalContext} from 'trans-render/lib/types.js';
import {XAction, } from './types.js';

export class XE<MCProps = any, MCActions = MCProps, TPropInfo = PropInfo, TAction extends XAction<MCProps> = XAction<MCProps>> extends CE<MCProps, MCActions, TPropInfo, TAction>{
    override pq(self: this, expr: LogicOp<any>, src: MCProps, ctx: LogicEvalContext = {op: 'and'}): boolean {
        const {op} = ctx;
        let answer = op === 'and' ? true : false;
        for(const logicalOp in expr){
            const rhs: any = (<any>expr)[logicalOp];
            
            if(logicalOp.endsWith('OneOf')) {
                ctx.op = 'or';
            }else if(logicalOp.endsWith('AllOf')){
                ctx.op = 'and';
            }else{
                continue;
            }
            
            if(!Array.isArray(rhs)) throw 'NI'; //Not Implemented
            const subAnswer = self.pqs(self, rhs, src)
            switch(op){
                case 'and':
                    if(!subAnswer) return false;
                    break;
                case 'or':
                    if(subAnswer) return true;
                    break;
            }
        }
        return answer;
    }

    override pqs(self: this, expr: ListOfLogicalExpressions, src: MCProps, ctx: LogicEvalContext = {op: 'and'}) : boolean {

    }
} 