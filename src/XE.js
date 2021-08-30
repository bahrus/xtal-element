import { CE } from 'trans-render/lib/CE.js';
import { applyP } from 'trans-render/lib/applyP.js';
import { applyPEA } from 'trans-render/lib/applyPEA.js';
export class XE extends CE {
    pq(self, expr, src, ctx = { op: 'and' }) {
        const { op } = ctx;
        let answer = op === 'and' ? true : false;
        for (const logicalOp in expr) {
            const rhs = expr[logicalOp];
            let foundMatch = false;
            for (const logicalOpsOption of logicalOpsLookup) {
                if (logicalOp.endsWith(logicalOpsOption[0])) {
                    ctx.op = logicalOpsOption[1];
                    foundMatch = true;
                    break;
                }
            }
            if (!foundMatch)
                continue;
            if (!Array.isArray(rhs))
                throw 'NI'; //Not Implemented
            const subAnswer = self.pqs(self, rhs, src, ctx);
            switch (op) {
                case 'and':
                    if (!subAnswer)
                        return false;
                    break;
                case 'or':
                    if (subAnswer)
                        return true;
                    break;
            }
        }
        return answer;
    }
    pqs(self, expr, src, ctx) {
        const { op } = ctx;
        let answer = false;
        switch (op) {
            case 'nor':
            case 'and':
                answer = true;
                break;
            case 'na':
                return true;
        }
        let lastVal;
        let isFirst = true;
        for (const subExpr of expr) {
            const subAnswer = self.pqsv(self, src, subExpr, ctx);
            switch (op) {
                case 'and':
                    if (!subAnswer)
                        return false;
                    break;
                case 'or':
                    if (subAnswer)
                        return true;
                    break;
                case 'nor':
                    if (subAnswer)
                        return false;
                    break;
                case 'nand':
                    if (!subAnswer)
                        return true;
                    break;
                case 'eq':
                    if (isFirst) {
                        lastVal = subAnswer;
                        isFirst = false;
                    }
                    else {
                        if (lastVal !== subAnswer)
                            return false;
                    }
            }
        }
        return answer;
    }
    pqsv(self, src, subExpr, ctx) {
        switch (typeof subExpr) {
            case 'string':
                if (ctx.op === 'eq')
                    return src[subExpr];
                return !!src[subExpr];
            case 'object':
                return self.pq(self, subExpr, src, ctx);
                break;
            default:
                throw 'NI'; //Not Implemented
        }
    }
    doPA(self, src, pci, m) {
        //PropInfoExt<MCProps>
        const { toLisp } = self;
        const { prop, key, ov, nv } = pci;
        const { notify } = prop;
        if (notify !== undefined && (m === '+a' || m === '+qr')) {
            const { dispatch, echoTo, toggleTo, echoDelay, reflect } = notify;
            const lispName = toLisp(key);
            if (dispatch) {
                src.dispatchEvent(new CustomEvent(lispName + '-changed', {
                    detail: {
                        oldValue: ov,
                        value: nv,
                    }
                }));
            }
            if (echoTo !== undefined) {
                if (echoDelay) {
                    let echoDelayNum = typeof (echoDelay) === 'number' ? echoDelay : self[echoDelay];
                    setTimeout(() => {
                        src[echoTo] = nv;
                    }, echoDelayNum);
                }
                else {
                    src[echoTo] = nv;
                }
            }
            if (toggleTo !== undefined) {
                src[toggleTo] = nv;
            }
            if (reflect !== undefined) {
                if (reflect.asAttr) {
                    src.inReflectMode = true;
                    let val = pci.nv;
                    let remAttr = false;
                    switch (pci.prop.type) {
                        case 'Number':
                            val = val.toString();
                            break;
                        case 'Boolean':
                            if (val) {
                                val = '';
                            }
                            else {
                                remAttr = true;
                            }
                            break;
                        case 'Object':
                            val = JSON.stringify(val);
                            break;
                    }
                    if (remAttr) {
                        src.removeAttribute(lispName);
                    }
                    else {
                        src.setAttribute(lispName, val);
                    }
                    src.inReflectMode = false;
                }
            }
            return true;
        }
        return super.doPA(self, src, pci, m);
    }
    getProps(self, expr, s = new Set()) {
        for (const logicalOp in expr) {
            const rhs = expr[logicalOp];
            if (!Array.isArray(rhs))
                continue;
            for (const logicalOpsOption of logicalOpsLookup) {
                if (logicalOp.endsWith(logicalOpsOption[0])) {
                    for (const rhsElement of rhs) {
                        switch (typeof rhsElement) {
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
    apply(host, target, returnVal) {
        if (target instanceof Element) {
            if (Array.isArray(returnVal)) {
                applyPEA(host, target, returnVal);
            }
            else {
                applyP(target, [returnVal]);
            }
        }
        else {
            Object.assign(target, returnVal);
        }
    }
    postHoc(self, action, host, returnVal) {
        if (action.target !== undefined) {
            let newTarget = host[action.target];
            if (newTarget === undefined) {
                console.warn('No target found');
                return;
            }
            if (newTarget instanceof NodeList) {
                newTarget = Array.from(newTarget);
            }
            if (Array.isArray(newTarget)) {
                for (const subTarget of newTarget) {
                    self.apply(host, subTarget, returnVal);
                }
            }
            else {
                self.apply(host, newTarget, returnVal);
            }
        }
        else {
            self.apply(host, host, returnVal);
        }
    }
}
const logicalOpsLookup = [['LeastOneOf', 'or'], ['AllOf', 'and'], ['NoneOf', 'nor'], ['Equals', 'eq'], ['KeyIn', 'na']];
