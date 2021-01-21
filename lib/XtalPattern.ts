export {XtalPattern, PropAction} from '../types.d.js';
import {XtalPattern, destructPropInfo} from '../types.d.js';
import {pinTheDOMToKeys} from './pinTheDOMToKeys.js';
import {PropAction} from '../types.d.js';

const createShadow = ({domCache, clonedTemplate, self}: XtalPattern) => {
    if(domCache===undefined) return;
    self.attachShadow!({mode: 'open'});
    self.shadowRoot!.appendChild(clonedTemplate!);
    self.clonedTemplate = undefined;
}

const attachShadow = ({handlersAttached, domCache, self}: XtalPattern) => {
    if(handlersAttached) createShadow(self);
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
] as PropAction[];

export const props = [
    ({clonedTemplate, domCache, mainTemplate}: XtalPattern) => ({
        type: Object,
        stopReactionsIfFalsy: true,
        async: false,
        dry: true,
    }),
    
] as destructPropInfo[];

export const xp = {createShadow, attachShadow, manageMainTemplate, props};