export {XtalPattern, PropAction, } from '../types.d.js';
import {XtalPattern} from '../types.d.js';
import {pinTheDOMToKeys} from './pinTheDOMToKeys.js';
import {PropAction, PropDefMap, PropDef} from '../types.d.js';
import {RxSuppl} from './RxSuppl.js';

const createShadow = ({domCache, clonedTemplate, styleTemplate, self}: XtalPattern) => {
    if(self.shadowRoot !== null) return;
    if(self.shadowRoot === null){
        self.attachShadow!({mode: 'open'});
        self.shadowRoot!.appendChild(clonedTemplate!);
    }
    if(styleTemplate !== undefined){
        self.shadowRoot!.appendChild(styleTemplate.content.cloneNode(true));
    }
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

export const common : PropDef = {
    type: Object,
    stopReactionsIfFalsy: true,
    async: false,
    dry: true,
} as PropDef;
export const transientCommon : PropDef = {
    ...common,
    transience: 5000,
}

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
 } as PropDefMap<XtalPattern>;

export const xp = {createShadow, attachShadow, manageMainTemplate, props, appendClone, RxSuppl};