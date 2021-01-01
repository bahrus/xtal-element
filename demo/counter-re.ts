import {define} from '../lib/define.js';
import {destructPropInfo, PropDef, ReactiveSurface, PropAction} from '../types.js';
import {getSlicedPropDefs} from '../lib/getSlicedPropDefs.js';
import {letThereBeProps} from '../lib/letThereBeProps.js';
import {html} from '../lib/html.js';
import {attr} from '../lib/attr.js';
import {Reactor} from '../lib/Reactor.js';
import {propUp} from '../lib/propUp.js';
import {pinTheDOMToKeys} from '../lib/pinTheDOMToKeys.js';
import {CounterDoProps} from './types.d.js';

const mainTemplate = html`
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
const propDefGetter : destructPropInfo[] = [
    ({clonedTemplate, domCache}: CounterDo) => ({
        type: Object,
        stopReactionsIfFalsy: true
    }),
    ({count}: CounterDo) => ({
        type: Number
    })
];
const slicedPropDefs = getSlicedPropDefs(propDefGetter);
const refs = {downPart: '', upPart: '', countPart: ''};

export class CounterDo extends HTMLElement implements CounterDoProps, ReactiveSurface{
    static is = 'counter-h';
    clonedTemplate: DocumentFragment | undefined;
    domCache: any;
    count!: number;
    connectedCallback(){
        this.attachShadow({mode: 'open'});
        const defaultValues: CounterDoProps = {count: 0};
        attr.mergeStr<CounterDoProps>(this, slicedPropDefs.numNames, defaultValues);
        propUp(this, slicedPropDefs.propNames, defaultValues);
        this.clonedTemplate = mainTemplate.content.cloneNode(true) as DocumentFragment;
    }
    onPropChange(name: string, prop: PropDef, nv: any){
        this.reactor.addToQueue(prop, nv);
    }
    propActions = [
        ({clonedTemplate}: CounterDo) => {
            const cache = {};
            pinTheDOMToKeys(clonedTemplate!, refs, cache);
            this.domCache = cache;
        },
        ({domCache, count}: CounterDo) => {
            domCache[refs.countPart].textContent = count.toString();
        },
        ({domCache, clonedTemplate}: CounterDo) => {
            domCache[refs.downPart].addEventListener('click', (e: Event) => {
                this.count--;
            });
            domCache[refs.upPart].addEventListener('click', (e: Event) => {
                this.count++;
            });
            this.shadowRoot!.appendChild(clonedTemplate!);
            this.clonedTemplate = undefined;
        },
    ] as PropAction[];
    reactor = new Reactor(this);
}
letThereBeProps(CounterDo, slicedPropDefs.propDefs, 'onPropChange');
define(CounterDo);