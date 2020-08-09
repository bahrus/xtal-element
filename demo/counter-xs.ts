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




interface ICounterMixin{
    count: number;
    changeCount(delta: number): void;
}

type CounterExtension = X & ICounterMixin;

export const CounterXMixin = (Base: any) => class extends Base{
    count = 0;

    changeCount(delta: number){
        this.count += delta;
    }
}

const [span$] = [Symbol('span')];
X.cessorize<CounterExtension>({
    name: 'counter-xs',
    mixins: [CounterXMixin],
    main: template,
    attributeProps: ({count}: ICounterMixin) => ({num:[count]}),
    initTransform: ({changeCount} : ICounterMixin) => ({
        button:[{},{click:[changeCount, 'dataset.d', parseInt]}] as any as PESettings<CounterExtension>, 
        span: span$,
    }) as TransformRules,
    updateTransforms:[ ({count}: ICounterMixin) => ({[span$]: count.toString()})]
})