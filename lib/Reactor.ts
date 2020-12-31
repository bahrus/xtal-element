import { IReactor, ReactiveSurface, PropAction, PropDef, ProcessorMap, getProcessor } from '../types.d.js';
import {getDestructArgs} from './getDestructArgs.js';
import {intersection} from './intersection.js';


export class Reactor implements IReactor {

    queue = new Set<string>();
    requestUpdate = false;
    deconstructedArgs = new WeakMap<PropAction, string[]>();
    constructor(public surface: ReactiveSurface , public returnMap?: ProcessorMap[], public getProcessor?: getProcessor) {
        if(getProcessor === undefined) import('./getProcessor.js');
     }

    async addToQueue(prop: PropDef) {
        this.queue.add(prop.name!);
        if (prop.async) {
            //https://medium.com/ing-blog/litelement-a-deepdive-into-batched-updates-b9431509fc4f
            if (!this.requestUpdate) {
                this.requestUpdate = true;
                this.requestUpdate = await false;
                this.processActionQueue();
            }
        } else {
            this.processActionQueue();
        }
    }

    async processActionQueue() {
        const queue = this.queue;
        this.queue = new Set<string>();
        for (const propAction of this.surface.propActions.flat()) {
            let args: string[] | undefined = undefined;
            if (!this.deconstructedArgs.has(propAction)) {
                args = getDestructArgs(propAction);
                this.deconstructedArgs.set(propAction, args);
            } else {
                args = this.deconstructedArgs.get(propAction);
            }
            const dependencySet = new Set<string>(args);
            if (intersection(queue, dependencySet).size > 0) {
                if (this.surface.propActionsHub !== undefined) this.surface.propActionsHub(propAction);
                const returnVal = propAction(this.surface as HTMLElement);

                if(this.returnMap !== undefined){
                    let processorGetter: getProcessor | undefined = this.getProcessor;
                    if(processorGetter === undefined){
                        const {getProcessor} = await import('./getProcessor.js');
                        processorGetter = getProcessor;
                    }
                    const processor = processorGetter(returnVal, this.returnMap);
                    if(processor !== undefined) processor.do(returnVal, this);
                }
            }
        }
        
    }
}