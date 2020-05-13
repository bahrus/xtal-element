import { XtalElement } from "./XtalElement";
export {TransformRules} from 'trans-render/types.d.js';
import {TransformRules} from 'trans-render/types.d.js';

export type SelectiveUpdate = (el: XtalElement) => TransformRules;
// export type Primitives = String | Number | Boolean | Symbol | Object;
export type PropDefGet<T = XtalElement> = (t: T) => AttributeProps;
// export interface PropDef{
//     type: Primitives;
//     readOnly: boolean;
//     reflect: boolean;
//     attribute: boolean;
//     notify: boolean;
// }

export interface AttributeProps{
    numeric?: any[];
    boolean?: any[];
    string?: any[];
    object?: any[];
    noReflect?: any[];
    notify?: any[];
}

export interface EvaluatedAttributeProps{
    numeric: string[];
    boolean: string[];
    string: string[];
    object: string[];
    noReflect: string[];
    parsedObject: string[];
    notify: string[];
}



