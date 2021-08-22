import {CE, PropInfo} from 'trans-render/lib/CE.js';
import {ListOfLogicalExpressions, LogicOp, LogicEvalContext} from 'trans-render/lib/types.js';
import {XAction, } from './types.js';

export class XE<MCProps = any, MCActions = MCProps, TPropInfo = PropInfo, TAction extends XAction<MCProps> = XAction<MCProps>> extends CE<MCProps, MCActions, TPropInfo, TAction>{
    override pq(self: this, expr: LogicOp<any>, src: MCProps, ctx: LogicEvalContext = {op: 'and'}): boolean {
        const {op} = ctx;
        let answer = op === 'and' ? true : false;
        for(const logicalOp in expr){
            const rhs: any = (<any>expr)[logicalOp];
            
            if(logicalOp.endsWith('LeastOneOf')) {
                ctx.op = 'or';
            }else if(logicalOp.endsWith('AllOf')){
                ctx.op = 'and';
            }else if(logicalOp.endsWith('NoneOf')){
                ctx.op = 'nor';
            }else if(logicalOp.endsWith('Equals')){
                ctx.op = 'eq';
            }else{
                continue;
            }
            
            if(!Array.isArray(rhs)) throw 'NI'; //Not Implemented
            const subAnswer = self.pqs(self, rhs, src, ctx);
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

    override pqs(self: this, expr: ListOfLogicalExpressions, src: MCProps, ctx: LogicEvalContext) : boolean {
        const {op} = ctx;
        let answer: boolean = false;
        switch(op){
            case 'nor':
            case 'and':
                answer = true;
                break;
            
        }
        let lastVal: any;
        let isFirst = true;
        for (const subExpr of expr) {
            const subAnswer = self.pqsv(self, src, subExpr, ctx);
            switch(op){
                case 'and':
                    if(!subAnswer) return false;
                    break;
                case 'or':
                    if(subAnswer) return true;
                    break;
                case 'nor':
                    if(subAnswer) return false;
                    break;
                case 'nand':
                    if(!subAnswer) return true;
                    break;
                case 'eq':
                    if(isFirst){
                        lastVal = subA
                    }
            }
        }
        return answer;    
    }

    override pqsv(self: this, src: any, subExpr: string | number | symbol | LogicOp<any>, ctx: LogicEvalContext): boolean{
        switch(typeof subExpr){
            case 'string':
                if(ctx.op === 'eq') return src[subExpr];
                return !!src[subExpr];
            case 'object':
                return self.pq(self, subExpr, src, ctx);
                break;
            default:
                throw 'NI'; //Not Implemented
        }
    }
} 