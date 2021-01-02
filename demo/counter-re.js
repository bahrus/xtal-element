import { define } from '../lib/define.js';
import { getPropDefs } from '../lib/getPropDefs.js';
import { hydrate } from '../lib/hydrate.js';
import { letThereBeProps } from '../lib/letThereBeProps.js';
import { html } from '../lib/html.js';
import { Reactor } from '../lib/Reactor.js';
import { doDOMKeyPEAction } from '../lib/doDOMKeyPEAction.js';
import { xp, manageMainTemplate } from '../lib/XtalPattern.js';
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
    ({ clonedTemplate, domCache, mainTemplate }) => ({
        type: Object,
        stopReactionsIfFalsy: true,
        async: true,
        dry: true,
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
        this.reactor = new Reactor(this, [
            {
                type: Array,
                do: doDOMKeyPEAction
            }
        ]);
        this.self = this;
        this.refs = refs;
        this.mainTemplate = mainTemplate;
        this.propActions = [
            manageMainTemplate,
            ({ domCache, count }) => ([
                { [refs.countPart]: [{ textContent: count }] }
            ]),
            ({ domCache, changeCount }) => ([
                { [refs.downPart]: [, { click: [changeCount, 'dataset.d', parseInt] }] },
                { [refs.upPart]: '"' }
            ]),
            xp.createShadow
        ];
    }
    connectedCallback() {
        hydrate(this, propDefs, {
            count: 0
        });
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
