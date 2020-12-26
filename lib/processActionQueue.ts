import {ReactiveCoordinator, PropAction, PropDef} from '../types.d.js';
import {getDestructArgs} from './getDestructArgs.js';
import {intersection} from './intersection.js';



const queueMap = new WeakMap<ReactiveCoordinator, Set<string>>();
const deconstructedArgs = new WeakMap<PropAction, string[]>();

export async function addToQueue(reactiveCoordinator: ReactiveCoordinator, prop: PropDef){
    let queue: Set<string> | undefined = undefined;
    if(!queueMap.has(reactiveCoordinator as ReactiveCoordinator)){
        queue = new Set<string>();
        queueMap.set(reactiveCoordinator, queue);
    }else{
        queue = queueMap.get(reactiveCoordinator)!;
    }
    queue.add(prop.name!);
    if(prop.async){
        //https://medium.com/ing-blog/litelement-a-deepdive-into-batched-updates-b9431509fc4f
        if(!reactiveCoordinator._requestUpdate){
            reactiveCoordinator._requestUpdate = true;
            reactiveCoordinator._requestUpdate = await false;
            processActionQueue(reactiveCoordinator);
        }
    }else{
        processActionQueue(reactiveCoordinator);
    }
}
export function processActionQueue(reactiveCoordinator: ReactiveCoordinator){
    if(!queueMap.has(reactiveCoordinator)){
        return;
    }
    const queue = queueMap.get(reactiveCoordinator)!;
    queueMap.set(reactiveCoordinator, new Set<string>());
    for(const propAction of reactiveCoordinator.propActions){
        let args: string[] | undefined = undefined;
        if(!deconstructedArgs.has(propAction)){
            args = getDestructArgs(propAction);
            deconstructedArgs.set(propAction, args);
        }else{
            args = deconstructedArgs.get(propAction);
        }
        const dependencySet = new Set<string>(args);
        if(intersection(queue, dependencySet).size > 0){
            if(reactiveCoordinator.propActionsHub !== undefined) reactiveCoordinator.propActionsHub(propAction);
            propAction(reactiveCoordinator.self);
        }
    }
    //const dependencies = deconstruct(propAction as Function);
}