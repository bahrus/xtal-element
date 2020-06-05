import { XtalElement } from "./XtalElement";
import { X } from './X.js';
export {TransformRules, PESettings, EvaluatedAttributeProps} from 'trans-render/types.d.js';
import {TransformRules, TransformValueOptions} from 'trans-render/types.d.js';
export type SelectiveUpdate<T extends XtalElement = XtalElement>  = (t: T) => TransformRules;
export type PropDefGet<T extends XtalElement = XtalElement> = (t: T) => AttributeProps;
export type TransformGetter<T extends XtalElement = XtalElement> = (t : T) => TransformValueOptions;
export type PropAction<T extends HTMLElement = HTMLElement> = (t: T) => void;

export interface AttributeProps{
    num?: any[];
    bool?: any[];
    str?: any[];
    obj?: any[];
    reflect?: any[];
    jsonProp?: any[];
    notify?: any[];
    dry?: any[];
    log?: any[];
    debug?: any[];
    async?: any[];
}



export interface tendArgs<T extends X = X>{
    name: string,
    class: any,
    attributeProps: PropDefGet<T>,
    main: string,
    initTransform: TransformGetter<T>,
    updateTransforms?: SelectiveUpdate<T>[]
}



