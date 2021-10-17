import {CE, PropInfo} from 'trans-render/lib/CE.js';
export {PropInfo} from 'trans-render/lib/types';
import {applyP} from 'trans-render/lib/applyP.js';
import {applyPEA} from 'trans-render/lib/applyPEA.js';
import {ListOfLogicalExpressions, LogicOp, LogicEvalContext, OpOptions, PropChangeInfo, PropChangeMoment, Action, PEAUnionSettings} from 'trans-render/lib/types.js';
import {XAction, PropInfoExt} from './types.js';
export {PropInfoExt} from './types.js';

export class XE<
    MCProps = any, MCActions = MCProps, 
    TPropInfo extends PropInfoExt<MCProps> = PropInfoExt<MCProps>, 
    TAction extends XAction<MCProps> = XAction<MCProps>> extends CE<MCProps, MCActions, TPropInfo, TAction
>{

    override pq(self: this, expr: LogicOp<any>, src: MCProps, ctx: LogicEvalContext = {op: 'and'}): boolean {
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

    override pqs(self: this, expr: ListOfLogicalExpressions, src: MCProps, ctx: LogicEvalContext) : boolean {
        const {op} = ctx;
        let answer: boolean = false;
        switch(op){
            case 'nor':
            case 'and':
                answer = true;
                break;
            case 'na':
                return true;
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

    override doPA(self: this, src: EventTarget, pci: PropChangeInfo , m: PropChangeMoment): boolean{ 
        //PropInfoExt<MCProps>
        const {toLisp} = self;
        const {prop, key, ov, nv}: {prop: PropInfoExt<MCProps>, key: string, ov: any, nv: any} = pci;
        const {notify} = prop;
        if(notify !== undefined && (m === '+a' || m === '+qr')){
            const {dispatch, echoTo, toggleTo, toggleDelay, echoDelay, reflect} = notify;
            const lispName = toLisp(key);
            if(dispatch){
                src.dispatchEvent(new CustomEvent(lispName + '-changed', {
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
                        (<any>src)[echoTo] = nv;
                    }, echoDelayNum);
                }else{
                    (<any>src)[echoTo] = nv;
                }
                
            }
            if(toggleTo !== undefined){
                if(toggleDelay){
                    const toggleDelayNum: number = typeof(toggleDelay) === 'number' ? toggleDelay : (<any>self)[toggleDelay];
                    setTimeout(() => {
                        (<any>src)[toggleTo] = !nv;
                    }, toggleDelayNum);
                }else{
                    (<any>src)[toggleTo] = !nv;
                }
            }
            if(reflect !== undefined){
                if(reflect.asAttr){
                    (<any>src).inReflectMode = true;
                    let val = pci.nv;
                    let remAttr = false;
                    switch(pci.prop.type){
                        case 'Number':
                            val = val.toString();
                            break;
                        case 'Boolean':
                            if(val){
                                val = ''
                            }else{
                                remAttr = true;
                                
                            }
                            break;
                        case 'Object':
                            val = JSON.stringify(val);
                            break;
                    }
                    if(remAttr){
                        (<any>src).removeAttribute(lispName);
                    }else{
                        (<any>src).setAttribute(lispName, val);
                    }
                    (<any>src).inReflectMode = false;
                }
            }
            return true;
        }

        return super.doPA(self, src, pci, m);
    }

    override getProps(self: this,  expr: Action<any>, s: Set<string> = new Set<string>()): Set<string>{
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

    apply(host: Element, target: any, returnVal: any, proxy: any){
        const dest = proxy !== undefined ? proxy : target;
        if(dest instanceof Element){
            if(Array.isArray(returnVal)){
                applyPEA(host, dest, returnVal as PEAUnionSettings);
            }else{
                applyP(dest, [returnVal]);
            }
        }else{
            Object.assign(dest, returnVal);
        }
    }

    postHoc(self: this, action: Action, host: Element, returnVal: any, proxy: any){
        if(action.target !== undefined){
            let newTarget = (<any>host)[action.target];
            if(newTarget === undefined) {
                console.warn('No target found');
                return;
            }
            if(newTarget instanceof NodeList){
                newTarget = Array.from(newTarget);
            }
            if(Array.isArray(newTarget)){
                for(const subTarget of newTarget){
                    self.apply(host, subTarget, returnVal, proxy);
                }
            }else{
                self.apply(host, newTarget, returnVal, proxy);
            }
        }else{
            self.apply(host, host, returnVal, proxy);
        }
        
    }
} 

const logicalOpsLookup : [string, OpOptions][] = [['LeastOneOf', 'or'], ['AllOf', 'and'], ['NoneOf', 'nor'], ['Equals', 'eq'], ['KeyIn', 'na']];