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
const refs = {buttonElement: '*', spanElement: ''};
const propActions = [
  ({domCache, self}: CounterMi) => [
    {[refs.buttonElement]: [,{click:[self.changeCount, 'dataset.d', parseInt]}]}
  ],
  ({domCache, count}: CounterMi) => [
    {[refs.spanElement]:  count}
  ]
] as PropAction[];

export abstract class CounterMi extends X{
    count = 0;

    changeCount(delta: number){
        this.count += delta;
    }
}



X.tend({
    name: 'counter-mi',
    class: CounterMi as any as {new(): X},
    mainTemplate: mainTemplate,
    propActions: propActions,
    refs: refs
});