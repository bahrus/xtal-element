import { decorate } from 'trans-render/decorate.js';
export const initDecorators = Symbol('initDeco');
export const updateDecorators = Symbol('updateDeco');
export function DataDecorators(superClass) {
    return class extends superClass {
        [initDecorators](target) {
            const decorators = target.dataset.initDecorators;
            decorators.split(';').forEach(decorator => {
                decorate(target, this[decorator]);
            });
        }
        [updateDecorators](target) {
            const decorators = target.dataset.updateDecorators;
            decorators.split(';').forEach(decorator => {
                this[decorator](target);
            });
        }
    };
}
