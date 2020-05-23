import { XtalElement, define } from './XtalElement.js';
import { createTemplate } from 'trans-render/createTemplate.js';
import { tendArgs, SelectiveUpdate, TransformGetter, } from './types.d.js';

export { TransformGetter, TransformRules } from './types.d.js';
export abstract class X extends XtalElement{
    static tend<T extends X = X>(args: tendArgs<T>){
        abstract class newClass extends args.class {
            static is = args.name;
            static attributeProps = args.attributeProps;
            readyToInit = true;
            readyToRender = true;
        }
        const p = newClass.prototype;
        p.initTransform = args.initTransform as TransformGetter<XtalElement>;
        p.updateTransforms = args.updateTransforms as SelectiveUpdate<XtalElement>[];
        p.mainTemplate = createTemplate(args.main);
        define(newClass);
    }
}