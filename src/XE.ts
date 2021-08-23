import {CE, PropInfo} from 'trans-render/lib/CE.js';
import {ListOfLogicalExpressions, LogicOp, LogicEvalContext, OpOptions, PropChangeInfo, PropChangeMoment, Action} from 'trans-render/lib/types.js';
import {XAction, PropInfoExt} from './types.js';

export class XE<
    MCProps = any, MCActions = MCProps, 
    TPropInfo extends PropInfoExt<MCProps> = PropInfoExt<MCProps>, 
    TAction extends XAction<MCProps> = XAction<MCProps>> extends CE<MCProps, MCActions, TPropInfo, TAction
>{

    pq(self: this, expr: LogicOp<any>, src: MCProps, ctx: LogicEvalContext = {op: 'and'}): boolean {
        const {op} = ctx;
        let answer = op === 'and' ? true : false;
        for(const logicalOp in expr){
            const rhs: any = (<any>expr)[logicalOp];
            let foundMatch = false;
            for(const logicalOpsOption of logicalOpsLookup){
                if(logicalOp.endsWith(logicalOpsOption[0])){
                    ctx.op = logicalOpsOption[1];
                    foundMatch = true;
                    break;
                }
            }
            if(!foundMatch) continue;

            
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

    pqs(self: this, expr: ListOfLogicalExpressions, src: MCProps, ctx: LogicEvalContext) : boolean {
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
                        lastVal = subAnswer;
                        isFirst = false;
                    }else{
                        if(lastVal !== subAnswer) return false;
                    }
            }
        }
        return answer;    
    }

    pqsv(self: this, src: any, subExpr: string | number | symbol | LogicOp<any>, ctx: LogicEvalContext): boolean{
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

    doPA(self: this, src: EventTarget, pci: PropChangeInfo , m: PropChangeMoment): boolean{ 
        //PropInfoExt<MCProps>
        const {toLisp} = self;
        const {prop, key, ov, nv}: {prop: PropInfoExt<MCProps>, key: string, ov: any, nv: any} = pci;
        const {notify} = prop;
        if(notify !== undefined && (m === '+a' || m === '+qr')){
            const {dispatch, echoTo, toggleTo, echoDelay} = notify;
            if(dispatch){
                src.dispatchEvent(new CustomEvent(toLisp(key) + '-changed', {
                    detail:{
                        oldValue: ov,
                        value: nv,
                    }
                }));
            }
            if(echoTo !== undefined){
                if(echoDelay){
                    let echoDelayNum: number = typeof(echoDelay) === 'number' ? echoDelay : (<any>self)[echoDelay];
                    setTimeout(() => {
                        (<any>self)[echoTo] = nv;
                    }, echoDelayNum);
                }else{
                    (<any>self)[echoTo] = nv;
                }
                
            }
            if(toggleTo !== undefined){
                (<any>self)[toggleTo] = nv;
            }
        }

        return super.doPA(self, src, pci, m);
    }

    getProps(self: this,  expr: Action<any>, s: Set<string> = new Set<string>()): Set<string>{
        for(const logicalOp in expr){
            const rhs: any = (<any>expr)[logicalOp];
            if(!Array.isArray(rhs)) continue;
            for(const logicalOpsOption of logicalOpsLookup){
                if(logicalOp.endsWith(logicalOpsOption[0])){
                    for(const rhsElement of rhs){
                        switch(typeof rhsElement){
                            case 'string':
                                s.add(rhsElement);
                                break;
                            case 'object':
                                self.getProps(self, rhsElement, s);
                                break;
                        }

                    }
                }
            }
        }
        return s;
    }
} 

const logicalOpsLookup : [string, OpOptions][] = [['LeastOneOf', 'or'], ['AllOf', 'and'], ['NoneOf', 'nor'], ['Equals', 'eq']];