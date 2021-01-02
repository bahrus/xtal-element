import { pinTheDOMToKeys } from './pinTheDOMToKeys.js';
const createShadow = ({ domCache, clonedTemplate, self }) => {
    self.attachShadow({ mode: 'open' });
    self.shadowRoot.appendChild(clonedTemplate);
    self.clonedTemplate = undefined;
};
export const manageMainTemplate = [
    ({ mainTemplate, self }) => {
        self.clonedTemplate = mainTemplate.content.cloneNode(true);
    },
    ({ clonedTemplate, refs, self }) => {
        const cache = {};
        pinTheDOMToKeys(clonedTemplate, refs, cache);
        self.domCache = cache;
    },
];
export const props = ({ clonedTemplate, domCache, mainTemplate }) => ({
    type: Object,
    stopReactionsIfFalsy: true,
    async: true,
    dry: true,
});
export const xp = { createShadow, manageMainTemplate, props };
