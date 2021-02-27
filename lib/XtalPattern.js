import { pinTheDOMToKeys } from './pinTheDOMToKeys.js';
import { RxSuppl } from './RxSuppl.js';
const createShadow = ({ domCache, clonedTemplate, styleTemplate, self }) => {
    if (domCache === undefined)
        return;
    self.attachShadow({ mode: 'open' });
    self.shadowRoot.appendChild(clonedTemplate);
    if (styleTemplate !== undefined) {
        self.shadowRoot.appendChild(styleTemplate.content.cloneNode(true));
    }
    self.clonedTemplate = undefined;
};
const appendClone = ({ domCache, clonedTemplate, self }) => {
    if (domCache === undefined)
        return;
    self.appendChild(clonedTemplate);
};
const attachShadow = ({ handlersAttached, domCache, self }) => {
    if (handlersAttached)
        createShadow(self);
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
const common = {
    type: Object,
    stopReactionsIfFalsy: true,
    async: false,
    dry: true,
};
export const props = {
    clonedTemplate: common,
    domCache: common,
    mainTemplate: common,
    styleTemplate: {
        type: Object,
        dry: true,
    }
};
export const xp = { createShadow, attachShadow, manageMainTemplate, props, appendClone, RxSuppl };
