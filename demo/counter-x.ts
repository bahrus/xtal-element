import {html} from '../lib/html.js';
import {X} from '../lib/X.js';
import {PropAction} from '../types.d.js';

const mainTemplate = html`
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

const refs = {dData: '*', spanElement: ''};
export abstract class CounterX extends X{
    count = 0;

    changeCount(delta: number){
        this.count += delta;
    }
}

const propActions = [
  ({count}: CounterX) => ([
    {[refs.spanElement]:  count}
  ]),
  ({domCache, changeCount}: CounterX) => ([
    {[refs.dData]: [,{click:[changeCount, 'dataset.d', parseInt]}]}
  ])
] as PropAction[];

X.tend({
    name: 'counter-x',
    class: CounterX as any as {new(): X},
    mainTemplate: mainTemplate,
    propActions: propActions,
    refs: refs
})