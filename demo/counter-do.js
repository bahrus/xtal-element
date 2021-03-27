import { define } from '../lib/define.js';
import { getSlicedPropDefs } from '../lib/getSlicedPropDefs.js';
import { letThereBeProps } from '../lib/letThereBeProps.js';
import { html } from '../lib/html.js';
import { attr } from '../lib/attr.js';
import { Rx } from '../lib/Rx.js';
import { propUp } from '../lib/propUp.js';
import { pinTheDOMToKeys } from '../lib/pinTheDOMToKeys.js';
const mainTemplate = html `
<button part=down data-d=-1>-</button><span part=count></span><button part=up data-d=1>+</button>
<style>
    * {
      font-size: 200%;
    }

    span {
      width: 4rem;
      display: inline-block;
      text-align: center;
    }

    button {
      width: 4rem;
      height: 4rem;
      border: none;
      border-radius: 10px;
      background-color: seagreen;
      color: white;
    }
</style>
`;
const refs = { downPart: '', upPart: '', countPart: '' };
export class CounterDo extends HTMLElement {
    constructor() {
        super(...arguments);
        this.propActions = [
            ({ clonedTemplate }) => {
                const cache = {};
                pinTheDOMToKeys(clonedTemplate, refs, cache);
                this.domCache = cache;
            },
            ({ domCache, count }) => {
                domCache[refs.countPart].textContent = count.toString();
            },
            ({ domCache }) => {
                domCache[refs.downPart].addEventListener('click', (e) => {
                    this.count--;
                });
                domCache[refs.upPart].addEventListener('click', (e) => {
                    this.count++;
                });
                this.shadowRoot.appendChild(this.clonedTemplate);
                delete this.clonedTemplate;
            },
        ];
        this.reactor = new Rx(this);
    }
    connectedCallback() {
        this.attachShadow({ mode: 'open' });
        const defaultValues = { count: 0 };
        attr.mergeStr(this, slicedPropDefs.numNames, defaultValues);
        propUp(this, slicedPropDefs.propNames, defaultValues);
        this.clonedTemplate = mainTemplate.content.cloneNode(true);
    }
    onPropChange(name, prop, nv) {
        this.reactor.addToQueue(prop, nv);
    }
}
const nonFalsyObject = {
    type: Object,
    stopReactionsIfFalsy: true
};
const propDefs = {
    clonedTemplate: nonFalsyObject,
    domCache: nonFalsyObject,
    count: {
        type: Number
    }
};
const slicedPropDefs = getSlicedPropDefs(propDefs);
letThereBeProps(CounterDo, slicedPropDefs, 'onPropChange');
define(CounterDo);
