import {decorate} from 'trans-render/decorate.js';
type Constructor<T = {}> = new (...args: any[]) => T;
export const initDecorators = Symbol('initDeco');
export const updateDecorators = Symbol('updateDeco');

export interface IDataDecorator{
    [initDecorators](target: Element) : void;
    [updateDecorators](target: Element) : void;
}

export function DataDecorators<TBase extends Constructor>(superClass: TBase) {
    return class extends superClass implements IDataDecorator {
        [initDecorators](target: Element){
            const decorators = (target as HTMLElement).dataset.initDecorators!;
            decorators.split(';').forEach(decorator =>{
                decorate(target as HTMLElement, (<any>this)[decorator]);
            })
            
        }
    
        [updateDecorators](target: Element){
            const decorators = (target as HTMLElement).dataset.updateDecorators!;
            decorators.split(';').forEach(decorator =>{
                (<any>this)[decorator](target);
            })
            
        }
    }
}