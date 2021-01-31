import { getDestructArgs } from './getDestructArgs.js';
import { intersection } from './intersection.js';
export class Rx {
    constructor(surface) {
        this.surface = surface;
        this.queue = new Set();
        this.requestUpdate = false;
        this.deconstructedArgs = new WeakMap();
    }
    async addToQueue(prop, newVal) {
        this.queue.add(prop.name);
        if (this.surface.disabled)
            return;
        if (prop.async) {
            //https://medium.com/ing-blog/litelement-a-deepdive-into-batched-updates-b9431509fc4f
            if (!this.requestUpdate) {
                this.requestUpdate = true;
                this.requestUpdate = await false;
                this.processActionQueue();
            }
        }
        else {
            this.processActionQueue();
        }
    }
    async doPS(val, args) { }
    async processActionQueue() {
        if (this.surface.propActions === undefined)
            return;
        const flat = this.surface.propActions.flat();
        const queue = this.queue;
        this.queue = new Set();
        const self = this.surface;
        const ignoreProps = self.constructor.prototype.xtalIgnore;
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
            const ignore = intersection(ignoreProps, dependencySet);
            for (const prop of intersection(ignore, dependencySet)) {
                if (!self[prop]) {
                    foundFalsy = true;
                    break;
                }
            }
            if (foundFalsy)
                continue;
            if (intersection(queue, dependencySet).size > 0) {
                if (this.surface.propActionsHub !== undefined)
                    this.surface.propActionsHub(propAction);
                const returnVal = propAction(this.surface);
                await this.doPS(returnVal, args);
            }
        }
    }
}