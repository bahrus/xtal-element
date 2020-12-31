import { define } from '../lib/define.js';
import { getSlicedPropDefs } from '../lib/getSlicedPropDefs.js';
import { letThereBeProps } from '../lib/letThereBeProps.js';
import { html } from '../lib/html.js';
import { attr } from '../lib/attr.js';
import { Reactor } from '../lib/Reactor.js';
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
const propDefGetter = [
    ({ clonedTemplate, domCache }) => ({
        type: Object,
    }),
    ({ count }) => ({
        type: Number
    })
];
const slicedPropDefs = getSlicedPropDefs(propDefGetter);
const refs = {
    downPart: '',
    upPart: '',
    countPart: ''
};
export class CounterH extends HTMLElement {
    constructor() {
        super(...arguments);
        this.propActions = [
            ({ clonedTemplate }) => {
                if (clonedTemplate === undefined)
                    return;
                const cache = {};
                pinTheDOMToKeys(clonedTemplate, refs, cache);
                this.domCache = cache;
            },
            ({ domCache, clonedTemplate }) => {
                if (domCache === undefined || clonedTemplate === undefined)
                    return;
                domCache[refs.downPart].addEventListener('click', (e) => {
                    this.count--;
                });
                domCache[refs.upPart].addEventListener('click', (e) => {
                    this.count++;
                });
                const shadow = this.attachShadow({ mode: 'open' });
                shadow.appendChild(clonedTemplate);
                this.clonedTemplate = undefined;
            },
            ({ domCache, count }) => {
                if (domCache === undefined)
                    return;
                domCache[refs.countPart].textContent = count.toString();
            }
        ];
        this.reactor = new Reactor(this);
    }
    connectedCallback() {
        const defaultValues = {
            count: 0
        };
        attr.mergeStr(this, slicedPropDefs.numNames, defaultValues);
        propUp(this, slicedPropDefs.propNames, defaultValues);
        this.clonedTemplate = mainTemplate.content.cloneNode(true);
    }
    onPropChange(name, prop) {
        this.reactor.addToQueue(prop);
    }
}
CounterH.is = 'counter-h';
letThereBeProps(CounterH, slicedPropDefs.propDefs, 'onPropChange');
define(CounterH);
