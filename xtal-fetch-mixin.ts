import { XtalViewElement } from "./xtal-view-element";

type Constructor<T = {}> = new (...args: any[]) => T;

export function XtalFetchMixin<TView, TBase extends Constructor<XtalViewElement<TView>>>(superClass: TBase) {
}