import { getDestructArgs } from './getDestructArgs.js';
import { intersection } from './intersection.js';
export class Reactor {
    constructor(surface) {
        this.surface = surface;
        this.queue = new Set();
        this.requestUpdate = false;
        this.deconstructedArgs = new WeakMap();
    }
    async addToQueue(prop) {
        this.queue.add(prop.name);
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
    processActionQueue() {
        const queue = this.queue;
        this.queue = new Set();
        for (const propAction of this.surface.propActions.flat()) {
            let args = undefined;
            if (!this.deconstructedArgs.has(propAction)) {
                args = getDestructArgs(propAction);
                this.deconstructedArgs.set(propAction, args);
            }
            else {
                args = this.deconstructedArgs.get(propAction);
            }
            const dependencySet = new Set(args);
            if (intersection(queue, dependencySet).size > 0) {
                if (this.surface.propActionsHub !== undefined)
                    this.surface.propActionsHub(propAction);
                propAction(this.surface);
            }
        }
    }
}
