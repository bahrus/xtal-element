import { define } from '../lib/define.js';
import { getPropDefs } from '../lib/getPropDefs.js';
import { hydrate } from '../lib/hydrate.js';
import { letThereBeProps } from '../lib/letThereBeProps.js';
import { html } from '../lib/html.js';
import { Reactor } from '../lib/Reactor.js';
import { pinTheDOMToKeys } from '../lib/pinTheDOMToKeys.js';
import { doDOMKeyPEAction } from '../lib/doDOMKeyPEAction.js';
import { xp } from '../lib/XtalPattern.js';
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
        stopReactionsIfFalsy: true,
        async: true,
    }),
    ({ count }) => ({
        type: Number
    })
];
const propDefs = getPropDefs(propDefGetter);
const refs = { downPart: '', upPart: '', countPart: '' };
export class CounterRe extends HTMLElement {
    constructor() {
        super(...arguments);
        this.self = this;
        this.refs = refs;
        this.mainTemplate = mainTemplate;
        this.propActions = [
            ({ clonedTemplate }) => {
                const cache = {};
                pinTheDOMToKeys(clonedTemplate, refs, cache);
                this.domCache = cache;
            },
            ({ domCache, count }) => ([
                { [refs.countPart]: [{ textContent: count }] }
            ]),
            ({ domCache, changeCount }) => ([
                { [refs.downPart]: [, { click: [changeCount, 'dataset.d', parseInt] }] },
                { [refs.upPart]: '"' }
            ]),
            xp.createShadow
        ];
        this.reactor = new Reactor(this, [
            {
                type: Array,
                do: doDOMKeyPEAction
            }
        ]);
    }
    connectedCallback() {
        hydrate(this, propDefs, {
            count: 0
        });
        this.clonedTemplate = mainTemplate.content.cloneNode(true);
    }
    onPropChange(name, prop, nv) {
        this.reactor.addToQueue(prop, nv);
    }
    changeCount(delta) {
        this.count += delta;
    }
}
CounterRe.is = 'counter-re';
letThereBeProps(CounterRe, propDefs, 'onPropChange');
define(CounterRe);
