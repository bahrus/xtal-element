import { IReactor, ReactiveSurface, PropAction, PropDef, ProcessorMap } from '../types.d.js';
export {ReactiveSurface} from '../types.d.js';
import {getDestructArgs} from './getDestructArgs.js';
import {intersection} from './intersection.js';

export class Rx implements IReactor {

    queue = new Set<string>();
    subscribers: {propsOfInterest: Set<string>, callBack: (rs: ReactiveSurface) => void}[] = [];
    requestUpdate = false;
    deconstructedArgs = new WeakMap<PropAction, string[]>();
    constructor(public surface: ReactiveSurface) {}

    async addToQueue(prop: PropDef, newVal: any) {
        if(this.surface.suspendRx) return;
        const name = prop.name!;
        this.queue.add(name);
        if(this.surface.disabled && name !== 'disabled') return;
        if (prop.async) {
            queueMicrotask(() => {this.processActionQueue()});
        } else {
            this.processActionQueue();
        }
    }
    doPS(lhs: any, rhs: any, args: string[] | undefined){}
    async processActionQueue() {
        if(this.surface.propActions === undefined) return;
        const flat = this.surface.propActions.flat();
        const queue = this.queue;
        this.queue = new Set<string>();
        const self = this.surface as any;
        const ignoreFalsyProps = self.constructor.prototype.xtalIgnoreFalsy as Set<string>;
        const ignoreTruthyProps = self.constructor.prototype.xtalIgnoreTruthy as Set<string>;
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
            let foundTruthy = false;
            const ignoreFalsy = intersection(ignoreFalsyProps, dependencySet);
            const ignoreTruthy = intersection(ignoreTruthyProps, dependencySet);
            for(const prop of ignoreFalsy){
                if(!self[prop as string]){
                    foundFalsy = true;
                    break;
                }
            }
            for(const prop of ignoreTruthy){
                if(self[prop as string]){
                    foundTruthy = true;
                    break;
                }
            }
            if(foundFalsy || foundTruthy) continue;
            if (intersection(queue, dependencySet).size > 0) {
                if (this.surface.propActionsHub !== undefined) this.surface.propActionsHub(propAction);
                const returnVal = propAction(this.surface as HTMLElement);
                this.doPS(this.surface, returnVal, args);
            }
        }
        for(const subscriber of this.subscribers){
            if(intersection(subscriber.propsOfInterest, queue).size > 0){
                subscriber.callBack(this.surface);
            }
        }
    }

    subscribe(propsOfInterest: Set<string>, callBack: (rs: ReactiveSurface) => void){
        this.subscribers.push({propsOfInterest, callBack});
    }

    unsubscribe(propsOfInterest: Set<string>, callBack: (rs: ReactiveSurface) => void){
        const idx = this.subscribers.findIndex(s => s.propsOfInterest === propsOfInterest && s.callBack === callBack);
        if(idx > -1) this.subscribers.splice(idx, 1);
    }
}