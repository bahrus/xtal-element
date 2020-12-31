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
<button data-d=-1>-</button><span part=count></span><button data-d=1>+</button>
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
const refs: {[key:string]: string | symbol} = {
    dData: '',
    countPart: ''
};
export interface CounterHProps {
    clonedTemplate?: DocumentFragment | undefined;
    domCache?: any;
}
export class CounterH extends HTMLElement implements CounterHProps{
    static is = 'counter-h';
    clonedTemplate: DocumentFragment | undefined;
    domCache: any;
    count: number | undefined;
    connectedCallback(){
        const defaultValues: CounterHProps = {};
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
        ({domCache}: CounterH) => {
            console.log('iah');
        }
    ] as PropAction[];
    reactor = new Reactor(this);
}
letThereBeProps(CounterH, slicedPropDefs.propDefs, 'onPropChange');
define(CounterH)