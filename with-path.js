import { createNestedProp } from './createNestedProp.js';
export const with_path = 'with-path';
/**
 * Custom Element mixin that allows a property to be namespaced
 * @param superClass
 */
export function WithPath(superClass) {
    return class extends superClass {
        get withPath() {
            return this._withPath;
        }
        /**
        * object inside a new empty object, with key equal to this value.
        * E.g. if the incoming object is {foo: 'hello', bar: 'world'}
        * and with-path = 'myPath'
        * then the source object which be merged into is:
        * {myPath: {foo: 'hello', bar: 'world'}}
        * @attr with-path
        */
        set withPath(val) {
            this.setAttribute(with_path, val);
        }
        wrap(obj, target = {}) {
            if (this._withPath) {
                createNestedProp(target, this._withPath.split('.'), obj, true);
                return target;
            }
            else {
                return obj;
            }
        }
    };
}
