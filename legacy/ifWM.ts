import {IPropagator, IPropChg} from 'trans-render/froop/types';
import {INotify, PropInfoExt, IReflectTo, ICustomState} from '../types';
export async function ifWM(instance: EventTarget, propagator: IPropagator, key: string, oldValue: any, value: any, notify: INotify, propInfo: PropInfoExt) {
    const {wrapTo, mapTo} = notify;
    const isDefined = value !== undefined;
    if(isDefined && wrapTo !== undefined){
        const {key, lhs, rhs} = wrapTo;
        (<any>instance)[key] = (lhs || '') + value + (rhs || '');
    }
    if(mapTo !== undefined){
        const mapTos = Array.isArray(mapTo) ? mapTo : [mapTo];
        for(const mapToInstance of mapTos){
            const {key, map} = mapToInstance;
            for(const test of map){
                if(test[0] === value){
                    (<any>instance)[key] = test[1];
                    break;
                }
            }
        }

    }
}