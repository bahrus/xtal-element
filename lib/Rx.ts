import { IReactor, ReactiveSurface, PropAction, PropDef, ProcessorMap, getProcessor } from '../types.d.js';
export {ReactiveSurface, PSDo} from '../types.d.js';
import {getDestructArgs} from './getDestructArgs.js';
import {intersection} from './intersection.js';


export class Rx implements IReactor {

    queue = new Set<string>();
    requestUpdate = false;
    deconstructedArgs = new WeakMap<PropAction, string[]>();
    constructor(public surface: ReactiveSurface) {}

    async addToQueue(prop: PropDef, newVal: any) {
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
    async doPS(val: any, args: string[] | undefined){}
    async processActionQueue() {
        if(this.surface.propActions === undefined) return;
        const flat = this.surface.propActions.flat();
        const queue = this.queue;
        this.queue = new Set<string>();
        const self = this.surface as any;
        const ignoreProps = self.constructor.prototype.xtalIgnore as Set<string>;
        for (const propAction of flat) {
            let args: string[] | undefined = undefined;
            if (!this.deconstructedArgs.has(propAction)) {
                args = getDestructArgs(propAction);
                this.deconstructedArgs.set(propAction, args);
            } else {
                args = this.deconstructedArgs.get(propAction);
            }
            const dependencySet = new Set<string>(args);
            let foundFalsy = false;
            const ignore = intersection(ignoreProps, dependencySet);
            for(const prop of intersection(ignore, dependencySet)){
                if(!self[prop as string]){
                    foundFalsy = true;
                    break;
                }
            }
            if(foundFalsy) continue;
            if (intersection(queue, dependencySet).size > 0) {
                if (this.surface.propActionsHub !== undefined) this.surface.propActionsHub(propAction);
                const returnVal = propAction(this.surface as HTMLElement);
                await this.doPS(returnVal, args);
            }
        }
        
    }
}