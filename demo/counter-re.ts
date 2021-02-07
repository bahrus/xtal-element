import {define} from '../lib/define.js';
import {PropDef, PropAction, PropDefMap} from '../types.js';
import {hydrate} from '../lib/hydrate.js';
import {letThereBeProps} from '../lib/letThereBeProps.js';
import {html} from '../lib/html.js';
import {RxSuppl} from '../lib/RxSuppl.js';
import {CounterDoProps} from './types.d.js';
import {DOMKeyPE} from '../lib/DOMKeyPE.js';
import {XtalPattern, xp} from '../lib/XtalPattern.js';
import {getSlicedPropDefs} from '../lib/getSlicedPropDefs.js';


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
const refs = {buttonElements: '', countPart: ''};
const propActions = [
    xp.manageMainTemplate,
    ({domCache, count}: CounterRe) => [{
        [refs.countPart]:  count
    }],
    ({domCache, self}: CounterRe) => [{
        [refs.buttonElements]: [,{click:[self.changeCount, 'dataset.d', parseInt]}],
        
    }],
    xp.createShadow
] as PropAction[];

export class CounterRe extends HTMLElement implements CounterDoProps, XtalPattern{
    static is = 'counter-re';
    propActions = propActions;
    
    reactor = new RxSuppl(this, [
        {
            rhsType: Array,
            ctor: DOMKeyPE
        }
    ]);
    clonedTemplate: DocumentFragment | undefined; domCache: any;
    count!: number;
    connectedCallback(){
        hydrate<CounterDoProps>(this, slicedPropDefs, {
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
    

}
const propDefMap: PropDefMap<CounterRe> = {
    ...xp.props,
    count: {
        type: Number
    }
};
const slicedPropDefs = getSlicedPropDefs(propDefMap);
letThereBeProps(CounterRe, slicedPropDefs.propDefs, 'onPropChange');
define(CounterRe);