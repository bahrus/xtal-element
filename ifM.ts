import {IPropagator, IPropChg} from 'trans-render/froop/types';
import {INotify, PropInfoExt, IReflectTo, ICustomState} from './types';
export async function ifS(instance: EventTarget, propagator: IPropagator, key: string, oldValue: any, value: any, notify: INotify, propInfo: PropInfoExt) {
    const {mapTo} = notify;
    if(mapTo !== undefined){
        const {key, map} = mapTo;
        for(const test of map){
            if(test[0] === value){
                (<any>instance)[key] = test[1];
                break;
            }
        }
    }
}