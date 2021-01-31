export {XtalPattern, PropAction, } from '../types.d.js';
import {XtalPattern} from '../types.d.js';
import {pinTheDOMToKeys} from './pinTheDOMToKeys.js';
import {PropAction, PropDefMap, PropDef} from '../types.d.js';
import {Reactor} from './Reactor.js';

const createShadow = ({domCache, clonedTemplate, self}: XtalPattern) => {
    if(domCache===undefined) return;
    self.attachShadow!({mode: 'open'});
    self.shadowRoot!.appendChild(clonedTemplate!);
    self.clonedTemplate = undefined;
}

const appendClone = ({domCache, clonedTemplate, self}: XtalPattern) => {
    if(domCache===undefined) return;
    self.appendChild!(clonedTemplate as Node);
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

const common = {
    type: Object,
    stopReactionsIfFalsy: true,
    async: false,
    dry: true,
} as PropDef;

export const props = {
    clonedTemplate: common,
    domCache: common,
    mainTemplate: common
 } as PropDefMap<XtalPattern>;

export const xp = {createShadow, attachShadow, manageMainTemplate, props, appendClone};