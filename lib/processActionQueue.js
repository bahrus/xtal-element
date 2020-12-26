import { getDestructArgs } from './getDestructArgs.js';
import { intersection } from './intersection.js';
const queueMap = new WeakMap();
const deconstructedArgs = new WeakMap();
export async function addToQueue(reactiveCoordinator, prop) {
    let queue = undefined;
    if (!queueMap.has(reactiveCoordinator)) {
        queue = new Set();
        queueMap.set(reactiveCoordinator, queue);
    }
    else {
        queue = queueMap.get(reactiveCoordinator);
    }
    queue.add(prop.name);
    if (prop.async) {
        //https://medium.com/ing-blog/litelement-a-deepdive-into-batched-updates-b9431509fc4f
        if (!reactiveCoordinator._requestUpdate) {
            reactiveCoordinator._requestUpdate = true;
            reactiveCoordinator._requestUpdate = await false;
            processActionQueue(reactiveCoordinator);
        }
    }
    else {
        processActionQueue(reactiveCoordinator);
    }
}
export function processActionQueue(reactiveCoordinator) {
    if (!queueMap.has(reactiveCoordinator)) {
        return;
    }
    const queue = queueMap.get(reactiveCoordinator);
    for (const propAction of reactiveCoordinator.propActions) {
        let args = undefined;
        if (!deconstructedArgs.has(propAction)) {
            args = getDestructArgs(propAction);
            deconstructedArgs.set(propAction, args);
        }
        else {
            args = deconstructedArgs.get(propAction);
        }
        const dependencySet = new Set(args);
        if (intersection(queue, dependencySet).size > 0) {
            if (reactiveCoordinator.propActionsHub !== undefined)
                reactiveCoordinator.propActionsHub(propAction);
            propAction(reactiveCoordinator.self);
        }
    }
    //const dependencies = deconstruct(propAction as Function);
}
