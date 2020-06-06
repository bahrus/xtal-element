import { XtalElement, define } from './XtalElement.js';
import { createTemplate } from 'trans-render/createTemplate.js';
function defProto(newClass, args) {
    const p = newClass.prototype;
    p.initTransform = args.initTransform;
    p.updateTransforms = args.updateTransforms;
    p.mainTemplate = createTemplate(args.main);
    define(newClass);
}
export class X extends XtalElement {
    static tend(args) {
        let newClass = /** @class */ (() => {
            class newClass extends args.class {
                constructor() {
                    super(...arguments);
                    this.readyToInit = true;
                    this.readyToRender = true;
                }
            }
            newClass.is = args.name;
            newClass.attributeProps = args.attributeProps;
            return newClass;
        })();
        defProto(newClass, args);
    }
    static cessorize(args) {
        let base = X;
        args.mixins.forEach(mixin => {
            base = mixin(base);
        });
        let newClass = /** @class */ (() => {
            class newClass extends base {
                constructor() {
                    super(...arguments);
                    this.readyToInit = true;
                    this.readyToRender = true;
                }
            }
            newClass.is = args.name;
            newClass.attributeProps = args.attributeProps;
            return newClass;
        })();
        defProto(newClass, args);
    }
}
