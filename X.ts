import { XtalElement } from './XtalElement.js';
import { PropDefGet, TransformGetter, SelectiveUpdate } from './types.d.js';

export interface tendArgs<T extends X = X>{
    name: string,
    class: Function,
    propsInfo?: PropDefGet<T>,
    main: string,
    initTransform?: TransformGetter<T>,
    updateTransforms?: SelectiveUpdate<T>[]
}

export abstract class X extends XtalElement{
    readyToInit = true;
    readyToRender = true;

    static tend<T extends X = X>(args: tendArgs){

    }
}