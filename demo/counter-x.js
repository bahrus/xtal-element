import { html } from '../lib/html.js';
import { X } from '../lib/X.js';
const mainTemplate = html `
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
const refs = { dData: '*', spanElement: '' };
export class CounterX extends X {
    constructor() {
        super(...arguments);
        this.count = 0;
    }
    changeCount(delta) {
        this.count += delta;
    }
}
const propActions = [
    ({ count }) => ([
        { [refs.spanElement]: count }
    ]),
    ({ domCache, self }) => ([
        { [refs.dData]: [, { click: [self.changeCount, 'dataset.d', parseInt] }] }
    ])
];
X.tend({
    name: 'counter-x',
    class: CounterX,
    mainTemplate: mainTemplate,
    propActions: propActions,
    refs: refs
});
