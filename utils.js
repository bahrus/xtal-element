import { init } from 'trans-render/init.js';
export function createTemplate(innerHTML) {
    const template = document.createElement("template");
    template.innerHTML = innerHTML;
    return template;
}
export function newRenderContext(transformRules) {
    return {
        init: init,
        Transform: transformRules,
    };
}
