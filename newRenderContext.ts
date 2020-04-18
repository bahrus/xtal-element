import {init} from 'trans-render/init.js';
import {RenderContext, TransformRules, RenderOptions} from 'trans-render/init.d.js';

export function newRenderContext(transformRules: TransformRules) : RenderContext{
    return {
        init: init,
        Transform: transformRules,
    } as RenderContext;
}