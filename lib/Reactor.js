import { getDestructArgs } from './getDestructArgs.js';
import { intersection } from './intersection.js';
export class Reactor {
    constructor(surface, PSMap, getProcessor) {
        this.surface = surface;
        this.PSMap = PSMap;
        this.getProcessor = getProcessor;
        this.queue = new Set();
        this.requestUpdate = false;
        this.deconstructedArgs = new WeakMap();
        this.ignore = new Set();
        if (getProcessor === undefined)
            import('./getProcessor.js');
    }
    async addToQueue(prop, newVal) {
        if (prop.stopReactionsIfFalsy) {
            const verb = !newVal ? 'add' : 'delete';
            this.ignore[verb](prop.name);
        }
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
    async processActionQueue() {
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
            if (intersection(dependencySet, this.ignore).size > 0)
                continue;
            if (intersection(queue, dependencySet).size > 0) {
                if (this.surface.propActionsHub !== undefined)
                    this.surface.propActionsHub(propAction);
                const returnVal = propAction(this.surface);
                if (this.PSMap !== undefined) {
                    let processorGetter = this.getProcessor;
                    if (processorGetter === undefined) {
                        const { getProcessor } = await import('./getProcessor.js');
                        processorGetter = getProcessor;
                    }
                    const processor = processorGetter(returnVal, this.PSMap);
                    if (processor !== undefined) {
                        const ctor = processor.ctor;
                        switch (typeof ctor) {
                            case 'function':
                                const processorInstance = new ctor();
                                processorInstance.do(returnVal, args, this);
                                break;
                            case 'object':
                                ctor.do(returnVal, args, this);
                                break;
                        }
                    }
                }
            }
        }
    }
}
