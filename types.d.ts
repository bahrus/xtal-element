import { XtalElement } from "./XtalElement";
export {TransformRules, PESettings} from 'trans-render/types.d.js';
import {TransformRules} from 'trans-render/types.d.js';

export type SelectiveUpdate = (el: XtalElement) => TransformRules;
export type PropDefGet<T = XtalElement> = (t: T) => AttributeProps;


export interface AttributeProps{
    numeric?: any[];
    boolean?: any[];
    string?: any[];
    object?: any[];
    reflect?: any[];
    parsedObject?: any[];
    notify?: any[];
}

export interface EvaluatedAttributeProps{
    numeric: string[];
    boolean: string[];
    string: string[];
    object: string[];
    reflect: string[];
    parsedObject: string[];
    notify: string[];
}



