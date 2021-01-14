import { IReactor, ReactiveSurface, PropAction, PropDef, ProcessorMap, getProcessor } from '../types.d.js';
export {ReactiveSurface, PSDo} from '../types.d.js';
import {getDestructArgs} from './getDestructArgs.js';
import {intersection} from './intersection.js';


export class Reactor implements IReactor {

    queue = new Set<string>();
    requestUpdate = false;
    deconstructedArgs = new WeakMap<PropAction, string[]>();
    ignore = new Set<string>();
    constructor(public surface: ReactiveSurface , public PSMap?: ProcessorMap[], public getProcessor?: getProcessor) {
        if(getProcessor === undefined) import('./getProcessor.js');
     }

    async addToQueue(prop: PropDef, newVal?: any) {
        if(prop.stopReactionsIfFalsy){
            const verb = !newVal ? 'add' : 'delete';
            this.ignore[verb](prop.name!); 
        }
        this.queue.add(prop.name!);
        if(this.surface.disabled) return;
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
            if(intersection(dependencySet, this.ignore).size > 0) continue;
            if (intersection(queue, dependencySet).size > 0) {
                if (this.surface.propActionsHub !== undefined) this.surface.propActionsHub(propAction);
                const returnVal = propAction(this.surface as HTMLElement);
                if(this.PSMap !== undefined){
                    let processorGetter: getProcessor | undefined = this.getProcessor;
                    if(processorGetter === undefined){
                        const {getProcessor} = await import('./getProcessor.js');
                        processorGetter = getProcessor;
                    }
                    const processor = processorGetter(returnVal, this.PSMap);
                    if(processor !== undefined) {
                        const processorInstance = new processor.ctor();
                        processorInstance.do(returnVal, args, this);
                    }
                }
            }
        }
        
    }
}