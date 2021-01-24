import { XtalElement, define } from '../XtalElement.js';
import { createTemplate } from 'trans-render/createTemplate.js';
import { tendArgs, SelectiveUpdate, TransformGetter, } from '../types.js';

export { TransformGetter, TransformValueOptions } from '../types.js';

function defProto<T extends X = X>(newClass: any, args: tendArgs<T>){
    const p = newClass.prototype;
    p.initTransform = args.initTransform as TransformGetter<XtalElement>;
    p.updateTransforms = args.updateTransforms as SelectiveUpdate<XtalElement>[];
    p.mainTemplate = createTemplate(args.main);
    define(newClass);
}

export abstract class X extends XtalElement{
    static tend<T extends X = X>(args: tendArgs<T>){
        abstract class newClass extends args.class {
            static is = args.name;
            static attributeProps = args.attributeProps;
            readyToInit = true;
            readyToRender = true;
        }
        defProto(newClass, args);
    }

    static cessorize<T extends X = X>(args: tendArgs<T>){
        let base = X;
        args.mixins!.forEach(mixin => {
            base = mixin(base);
        })
        abstract class newClass extends base{
            static is = args.name;
            static attributeProps = args.attributeProps;
            readyToInit = true;
            readyToRender = true;
        }
        defProto(newClass, args);
    }
}