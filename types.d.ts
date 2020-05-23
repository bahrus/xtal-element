import { XtalElement } from "./XtalElement";
export {TransformRules, PESettings} from 'trans-render/types.d.js';
import {TransformRules} from 'trans-render/types.d.js';

export type SelectiveUpdate = (el: XtalElement) => TransformRules;
export type PropDefGet<T = XtalElement> = (t: T) => AttributeProps;


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



