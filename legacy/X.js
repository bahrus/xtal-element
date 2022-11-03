import { XtalElement, define } from '../XtalElement.js';
import { createTemplate } from 'trans-render/createTemplate.js';
export { TransformGetter, TransformValueOptions } from '../types.js';
function defProto(newClass, args) {
    const p = newClass.prototype;
    p.initTransform = args.initTransform;
    p.updateTransforms = args.updateTransforms;
    p.mainTemplate = createTemplate(args.main);
    define(newClass);
}
export class X extends XtalElement {
    static tend(args) {
        class newClass extends args.class {
            static is = args.name;
            static attributeProps = args.attributeProps;
            readyToInit = true;
            readyToRender = true;
        }
        defProto(newClass, args);
    }
    static cessorize(args) {
        let base = X;
        args.mixins.forEach(mixin => {
            base = mixin(base);
        });
        class newClass extends base {
            static is = args.name;
            static attributeProps = args.attributeProps;
            readyToInit = true;
            readyToRender = true;
        }
        defProto(newClass, args);
    }
}
