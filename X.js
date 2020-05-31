import { XtalElement, define } from './XtalElement.js';
import { createTemplate } from 'trans-render/createTemplate.js';
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
        const p = newClass.prototype;
        p.initTransform = args.initTransform;
        p.updateTransforms = args.updateTransforms;
        p.mainTemplate = createTemplate(args.main);
        define(newClass);
    }
}
