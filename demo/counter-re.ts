import {define} from '../lib/define.js';
import {destructPropInfo, PropDef, PropAction} from '../types.js';
import {getPropDefs} from '../lib/getPropDefs.js';
import {hydrate} from '../lib/hydrate.js';
import {letThereBeProps} from '../lib/letThereBeProps.js';
import {html} from '../lib/html.js';
import {Reactor} from '../lib/Reactor.js';
import {pinTheDOMToKeys} from '../lib/pinTheDOMToKeys.js';
import {CounterDoProps} from './types.d.js';
import {doDOMKeyPEAction} from '../lib/doDOMKeyPEAction.js';
import {XtalPattern, xp} from '../lib/XtalPattern.js';


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
    ({clonedTemplate, domCache, mainTemplate}: CounterRe) => ({
        type: Object,
        stopReactionsIfFalsy: true,
        async: true,
        dry: true,
    }),
    ({count}: CounterRe) => ({
        type: Number
    })
];
const propDefs = getPropDefs(propDefGetter);
const refs = {downPart: '', upPart: '', countPart: ''};

export class CounterRe extends HTMLElement implements CounterDoProps, XtalPattern{
    static is = 'counter-re';
    reactor = new Reactor(this, [
        {
            type: Array,
            do: doDOMKeyPEAction
        }
    ]);
    clonedTemplate: DocumentFragment | undefined;
    domCache: any;
    count!: number;
    connectedCallback(){
        hydrate<CounterDoProps>(this, propDefs, {
            count: 0
        });
        
    }
    onPropChange(name: string, prop: PropDef, nv: any){
        this.reactor.addToQueue(prop, nv);
    }
    changeCount(delta: number){
        this.count += delta;
    }
    self = this;
    refs = refs;
    mainTemplate = mainTemplate;
    propActions = [
        ({mainTemplate, self}: CounterRe) =>{
            self.clonedTemplate = mainTemplate.content.cloneNode(true) as DocumentFragment;
        },
        ({clonedTemplate}: CounterRe) => {
            const cache = {};
            pinTheDOMToKeys(clonedTemplate!, refs, cache);
            this.domCache = cache;
        },
        ({domCache, count}: CounterRe) => ([
            {[refs.countPart]: [{textContent: count}]}
        ]),
        ({domCache, changeCount}: CounterRe) => ([
            {[refs.downPart]: [,{click:[changeCount, 'dataset.d', parseInt]}]},
            {[refs.upPart]: '"'}
        ]),
        xp.createShadow
    ] as PropAction[];

}
letThereBeProps(CounterRe, propDefs, 'onPropChange');
define(CounterRe);