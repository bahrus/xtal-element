import {createNestedProp} from './createNestedProp.js';

/**
* Allows an object to be namespaced.
* object inside a new empty object, with key equal to this value.
* E.g. if the incoming object is {foo: 'hello', bar: 'world'}
* and with-path = 'myPath'
* then the source object which be merged into is:
* {myPath: {foo: 'hello', bar: 'world'}}
* @attr with-path
*/
export function wrap(obj: any, withPath: string | undefined, target: object = {}){
    if(withPath !== undefined){
        createNestedProp(target, withPath.split('.'), obj, true);
        return target;        
    }else{
        return obj;
    }
}