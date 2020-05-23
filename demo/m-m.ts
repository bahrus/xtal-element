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
export abstract class MM extends X{
    count = 0;

    changeCount(delta: number){
        this.count += delta;
    }
}

X.tend<MM>({
    name: 'm-m',
    class: MM,
    main: template,
    attributeProps: ({count}) => ({num:[count]}),
    initTransform: ({changeCount} : MM) => ({
        button:[,{click:[changeCount, 'dataset.d', parseInt]}] as any as PESettings<MM>, //TODO remove any
        span: span$,
    }) as TransformRules,
    updateTransforms:[ ({count}: MM) => ({[span$]: count.toString()})]
})