import { CE } from 'trans-render/lib/CE.js';
export class XE extends CE {
    pq(self, expr, src, ctx = { op: 'and' }) {
        const { op } = ctx;
        let answer = op === 'and' ? true : false;
        for (const logicalOp in expr) {
            const rhs = expr[logicalOp];
            if (logicalOp.endsWith('LeastOneOf')) {
                ctx.op = 'or';
            }
            else if (logicalOp.endsWith('AllOf')) {
                ctx.op = 'and';
            }
            else if (logicalOp.endsWith('NoneOf')) {
                ctx.op = 'nor';
            }
            else if (logicalOp.endsWith('Equals')) {
                ctx.op = 'eq';
            }
            else {
                continue;
            }
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
            const { dispatch, echoTo, toggleTo, echoDelay } = notify;
            if (dispatch) {
                src.dispatchEvent(new CustomEvent(toLisp(key) + '-changed', {
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
                        self[echoTo] = nv;
                    }, echoDelayNum);
                }
                else {
                    self[echoTo] = nv;
                }
            }
            if (toggleTo !== undefined) {
                self[toggleTo] = nv;
            }
        }
        return super.doPA(self, src, pci, m);
    }
}
