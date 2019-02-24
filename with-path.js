import { createNestedProp } from './createNestedProp.js';
export const with_path = 'with-path';
/**
 * Custom Element mixin that allows a property to be namespaced
 * @param superClass
 */
export function WithPath(superClass) {
    return class extends superClass {
        /**
        * @type {string}
        * object inside a new empty object, with key equal to this value.
        * E.g. if the incoming object is {foo: 'hello', bar: 'world'}
        * and with-path = 'myPath'
        * then the source object which be merged into is:
        * {myPath: {foo: 'hello', bar: 'world'}}
        */
        get withPath() {
            return this._withPath;
        }
        set withPath(val) {
            this.setAttribute(with_path, val);
        }
        wrap(obj) {
            if (this._withPath) {
                let mergedObj = {};
                createNestedProp(mergedObj, this._withPath.split('.'), obj, true);
                return mergedObj;
                // const retObj = mergedObj;
                // const splitPath = this._withPath.split('.');
                // const lenMinus1 = splitPath.length - 1;
                // splitPath.forEach((pathToken, idx) => {
                //     if(idx === lenMinus1){
                //         mergedObj[pathToken] = obj;
                //     }else{
                //         mergedObj = mergedObj[pathToken] = {};
                //     }
                // })
                // return retObj;
            }
            else {
                return obj;
            }
        }
    };
}
