import { createNestedProp } from '../createNestedProp.js';
export const with_path = 'with-path';
/**
 * Custom Element mixin that allows a property to be namespaced
 * @param superClass
 */
export function WithPath(superClass) {
    return class extends superClass {
        wrap(obj, target = {}) {
            if (this.withPath) {
                createNestedProp(target, this.withPath.split('.'), obj, true);
                return target;
            }
            else {
                return obj;
            }
        }
    };
}
