import { XtalViewElement } from "./xtal-view-element";

type Constructor<T = {}> = new (...args: any[]) => T;
const href = 'href';
const req_init = 'req-init';
export function XtalFetchMixin<TView, TBase extends Constructor<XtalViewElement<TView>>>(superClass: TBase) {
    
}