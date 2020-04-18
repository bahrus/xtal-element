import { init } from 'trans-render/init.js';
export function newRenderContext(transformRules) {
    return {
        init: init,
        Transform: transformRules,
    };
}
