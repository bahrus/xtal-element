import {define} from '../lib/define.js';
import {destructPropInfo, PropDef, ReactiveSurface, PropAction} from '../types.d.js';
import {getSlicedPropDefs} from '../lib/getSlicedPropDefs.js';
import {letThereBeProps} from '../lib/letThereBeProps.js';
import {html} from '../lib/html.js';
import {attr} from '../lib/attr.js';
import {Reactor} from '../lib/Reactor.js';
import {propUp} from '../lib/propUp.js';
import {pinTheDOMToKeys} from '../lib/pinTheDOMToKeys.js';

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
    ({clonedTemplate, domCache}: CounterH) => ({
        type: Object,
    }),
    ({count}: CounterH) => ({
        type: Number
    })
];
const slicedPropDefs = getSlicedPropDefs(propDefGetter);
const refs = {
    downPart: '',
    upPart: '',
    countPart: ''
};
export interface CounterHProps {
    clonedTemplate?: DocumentFragment | undefined;
    domCache?: any;
    count: number;
}
export class CounterH extends HTMLElement implements CounterHProps{
    static is = 'counter-h';
    clonedTemplate: DocumentFragment | undefined;
    domCache: any;
    count!: number;
    connectedCallback(){
        const defaultValues: CounterHProps = {
            count: 0
        };
        attr.mergeStr<CounterHProps>(this, slicedPropDefs.numNames, defaultValues);
        propUp(this, slicedPropDefs.propNames, defaultValues);
        this.clonedTemplate = mainTemplate.content.cloneNode(true) as DocumentFragment;
    }
    onPropChange(name: string, prop: PropDef){
        this.reactor.addToQueue(prop);
    }
    propActions = [
        ({clonedTemplate}: CounterH) => {
            if(clonedTemplate === undefined) return;
            const cache = {};
            pinTheDOMToKeys(clonedTemplate, refs, cache);
            this.domCache = cache;
        },
        ({domCache, clonedTemplate}: CounterH) => {
            if(domCache === undefined || clonedTemplate === undefined) return;
            domCache[refs.downPart].addEventListener('click', (e: Event) => {
                this.count--;
            });
            domCache[refs.upPart].addEventListener('click', (e: Event) => {
                this.count++;
            });
            const shadow = this.attachShadow({mode: 'open'});
            shadow.appendChild(clonedTemplate);
            this.clonedTemplate = undefined;
        },
        ({domCache, count}: CounterH) => {
            if(domCache === undefined) return;
            domCache[refs.countPart].textContent = count.toString();
        }
    ] as PropAction[];
    reactor = new Reactor(this);
}
letThereBeProps(CounterH, slicedPropDefs.propDefs, 'onPropChange');
define(CounterH)