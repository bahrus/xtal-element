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
            case 'eq':
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
        const { prop } = pci;
        const { notify } = prop;
        if (notify !== undefined && (m === '+a' || m === '+qr')) {
            (async () => {
                const { doNotify } = await import('./doNotify.js');
                return await doNotify(self, src, pci, notify);
            })();
        }
        return super.doPA(self, src, pci, m);
    }
    async api(args, props) {
        const propsWithNotifications = [];
        for (const key in props) {
            const propInfoExt = props[key];
            if (propInfoExt.notify !== undefined) {
                propsWithNotifications.push([key, propInfoExt]);
            }
        }
        if (propsWithNotifications.length === 0)
            return;
        const { getPropInfos } = await import('./doNotify.js');
        getPropInfos(props, propsWithNotifications);
    }
    //better name:  getPropsFromActions
    getProps(self, expr, s = new Set()) {
        if (typeof (expr) === 'string') {
            s.add(expr);
            return s;
        }
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
    apply(host, target, returnVal, proxy) {
        const dest = proxy !== undefined ? proxy : target;
        if (dest instanceof Element) {
            if (Array.isArray(returnVal)) {
                applyPEA(host, dest, returnVal);
            }
            else {
                applyP(dest, [returnVal]);
            }
        }
        else {
            Object.assign(dest, returnVal);
        }
    }
    postHoc(self, action, host, returnVal, proxy) {
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
                    let subTargetRef = subTarget;
                    if (subTargetRef.deref) {
                        subTargetRef = subTargetRef.deref();
                    }
                    self.apply(host, subTargetRef, returnVal, proxy);
                }
            }
            else {
                self.apply(host, newTarget, returnVal, proxy);
            }
        }
        else {
            self.apply(host, host, returnVal, proxy);
        }
    }
}
const logicalOpsLookup = [['LeastOneOf', 'or'], ['AllOf', 'and'], ['NoneOf', 'nor'], ['Equals', 'eq'], ['KeyIn', 'na']];
