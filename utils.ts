import {init} from 'trans-render/init.js';
import {RenderContext, TransformRules, RenderOptions} from 'trans-render/init.d.js'
export function createTemplate(innerHTML: string): HTMLTemplateElement {
    const template = document.createElement("template") as HTMLTemplateElement;
    template.innerHTML = innerHTML;
    return template;
}

export function newRenderContext(transformRules: TransformRules) : RenderContext{
    return {
        init: init,
        Transform: transformRules,
    } as RenderContext;
}