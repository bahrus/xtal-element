import {UnitOfWork, ITransformer} from 'trans-render/types';
export interface UtilMixinProps {

}
export interface UtilMixinMethods{
    localize(model: any, transformer: ITransformer<any, any>, uow: UnitOfWork<any, any>): string;
}

export interface UtilBase extends HTMLElement, UtilMixinProps, UtilMixinMethods {}

export type UtilMixinType = {new(): UtilBase }

export const UtilMixin = (superclass: UtilMixinType) => class extends superclass{
    localize(model: any, transformer: ITransformer<any, any>, uow: UnitOfWork<any, any>){
        const {o} = uow;
        const a = o as string[];
        if(a.length !== 1) throw 'NI';
        const val = model[a[0]];
        if(val instanceof Date){
            return val.toLocaleDateString();
        }else if(typeof val === 'number'){
            return val.toLocaleString();
        }
        throw 'NI';
    }
}