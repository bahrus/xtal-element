import { XtalElement } from "./XtalElement";
export {TransformRules, PESettings} from 'trans-render/types.d.js';
import {TransformRules, TransformValueOptions} from 'trans-render/types.d.js';

export type SelectiveUpdate<T extends XtalElement = XtalElement>  = (t: T) => TransformRules;
export type PropDefGet<T extends XtalElement = XtalElement> = (t: T) => AttributeProps;
export type TransformGetter<T extends XtalElement = XtalElement> = (t : T) => TransformValueOptions;

export interface AttributeProps{
    num?: any[];
    bool?: any[];
    str?: any[];
    obj?: any[];
    reflect?: any[];
    jsonProp?: any[];
    notify?: any[];
}

export interface EvaluatedAttributeProps{
    num: string[];
    bool: string[];
    str: string[];
    obj: string[];
    reflect: string[];
    jsonProp: string[];
    notify: string[];
}



