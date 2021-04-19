import { getDestructArgs } from './getDestructArgs.js';
import { intersection } from './intersection.js';
export class Rx {
    constructor(surface) {
        this.surface = surface;
        this.queue = new Set();
        this.subscribers = [];
        this.requestUpdate = false;
        this.deconstructedArgs = new WeakMap();
    }
    async addToQueue(prop, newVal) {
        if (this.surface.suspendRx)
            return;
        const name = prop.name;
        this.queue.add(name);
        if (this.surface.disabled && name !== 'disabled')
            return;
        if (prop.async) {
            queueMicrotask(() => { this.processActionQueue(); });
        }
        else {
            this.processActionQueue();
        }
    }
    doPS(lhs, rhs, args) { }
    async processActionQueue() {
        if (this.surface.propActions === undefined)
            return;
        const flat = this.surface.propActions.flat();
        const queue = this.queue;
        this.queue = new Set();
        const self = this.surface;
        const ignoreFalsyProps = self.constructor.prototype.xtalIgnoreFalsy;
        const ignoreTruthyProps = self.constructor.prototype.xtalIgnoreTruthy;
        for (const propAction of flat) {
            let args = undefined;
            if (!this.deconstructedArgs.has(propAction)) {
                args = getDestructArgs(propAction);
                this.deconstructedArgs.set(propAction, args);
            }
            else {
                args = this.deconstructedArgs.get(propAction);
            }
            const dependencySet = new Set(args);
            let foundFalsy = false;
            let foundTruthy = false;
            const ignoreFalsy = intersection(ignoreFalsyProps, dependencySet);
            const ignoreTruthy = intersection(ignoreTruthyProps, dependencySet);
            for (const prop of ignoreFalsy) {
                if (!self[prop]) {
                    foundFalsy = true;
                    break;
                }
            }
            for (const prop of ignoreTruthy) {
                if (self[prop]) {
                    foundTruthy = true;
                    break;
                }
            }
            if (foundFalsy || foundTruthy)
                continue;
            if (intersection(queue, dependencySet).size > 0) {
                if (this.surface.propActionsHub !== undefined)
                    this.surface.propActionsHub(propAction);
                const returnVal = propAction(this.surface);
                this.doPS(this.surface, returnVal, args);
            }
        }
        for (const subscriber of this.subscribers) {
            if (intersection(subscriber.propsOfInterest, queue).size > 0) {
                subscriber.callBack(this.surface);
            }
        }
    }
    subscribe(propsOfInterest, callBack) {
        this.subscribers.push({ propsOfInterest, callBack });
    }
}
