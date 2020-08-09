import {X, TransformGetter, TransformRules} from '../X.js';
import {PESettings} from 'trans-render/types.d.js';
import { SelectiveUpdate } from '../types.js';

const template = /* html */`
<button data-d=-1>-</button><span></span><button data-d=1>+</button>
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

const [span$] = [Symbol('span')];
export abstract class CounterX extends X{
    count = 0;

    changeCount(delta: number){
        this.count += delta;
    }
}

X.tend<CounterX>({
    name: 'counter-x',
    class: CounterX,
    main: template,
    attributeProps: ({count}) => ({num:[count]}),
    initTransform: ({changeCount} : CounterX) => ({
        button:[{},{click:[changeCount, 'dataset.d', parseInt]}] as  PESettings<CounterX>, 
        span: span$,
    }) as TransformRules,
    updateTransforms:[ ({count}: CounterX) => ({[span$]: count.toString()})]
})