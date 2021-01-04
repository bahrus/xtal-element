export {XtalPattern} from '../types.d.js';
import {XtalPattern, destructPropInfo} from '../types.d.js';
import {pinTheDOMToKeys} from './pinTheDOMToKeys.js';

const createShadow = ({domCache, clonedTemplate, self}: XtalPattern) => {
    self.attachShadow!({mode: 'open'});
    self.shadowRoot!.appendChild(clonedTemplate!);
    self.clonedTemplate = undefined;
}

export const manageMainTemplate = [
    ({mainTemplate, self}: XtalPattern) =>{
        self.clonedTemplate = mainTemplate.content.cloneNode(true) as DocumentFragment;
    },
    ({clonedTemplate, refs, self}: XtalPattern) => {
        const cache = {};
        pinTheDOMToKeys(clonedTemplate!, refs, cache);
        self.domCache = cache;
    },
] 

export const props = [
    ({clonedTemplate, domCache, mainTemplate}: XtalPattern) => ({
        type: Object,
        stopReactionsIfFalsy: true,
        async: false,
        dry: true,
    }),
    ({}: XtalPattern) => ({
        type: Object,
        stopReactionsIfFalsy: true,
        async: false,
        dry: true,
        parse: true,
    })
] as destructPropInfo[];

export const xp = {createShadow, manageMainTemplate, props};