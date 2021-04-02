import { pinTheDOMToKeys } from './pinTheDOMToKeys.js';
import { RxSuppl } from './RxSuppl.js';
const createShadow = ({ domCache, clonedTemplate, styleTemplate, self }) => {
    if (self.shadowRoot !== null)
        return;
    if (self.shadowRoot === null) {
        self.attachShadow({ mode: 'open' });
        self.shadowRoot.appendChild(clonedTemplate);
    }
    if (styleTemplate !== undefined) {
        self.shadowRoot.appendChild(styleTemplate.content.cloneNode(true));
    }
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
export const common = {
    type: Object,
    stopReactionsIfFalsy: true,
    async: false,
    dry: true,
};
export const transientCommon = {
    ...common,
    transience: 5000,
};
export const props = {
    clonedTemplate: transientCommon,
    domCache: common,
    mainTemplate: {
        ...common,
        byoAttrib: 'byo-m-t'
    },
    styleTemplate: {
        type: Object,
        dry: true,
        byoAttrib: 'byo-s-t'
    }
};
export const xp = { createShadow, attachShadow, manageMainTemplate, props, appendClone, RxSuppl };
