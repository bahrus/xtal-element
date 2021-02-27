export {XtalPattern, PropAction, } from '../types.d.js';
import {XtalPattern} from '../types.d.js';
import {pinTheDOMToKeys} from './pinTheDOMToKeys.js';
import {PropAction, PropDefMap, PropDef} from '../types.d.js';
import {RxSuppl} from './RxSuppl.js';

const createShadow = ({domCache, clonedTemplate, styleTemplate, self}: XtalPattern) => {
    if(domCache===undefined) return;
    self.attachShadow!({mode: 'open'});
    self.shadowRoot!.appendChild(clonedTemplate!);
    if(styleTemplate !== undefined){
        self.shadowRoot!.appendChild(styleTemplate.content.cloneNode(true));
    }
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
    mainTemplate: common,
    styleTemplate: {
        type: Object,
        dry: true,
    }
 } as PropDefMap<XtalPattern>;

export const xp = {createShadow, attachShadow, manageMainTemplate, props, appendClone, RxSuppl};