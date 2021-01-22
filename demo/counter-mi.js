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
const refs = { buttonElement: '*', spanElement: '' };
export class CounterMi extends X {
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
        { [refs.buttonElement]: [, { click: [self.changeCount, 'dataset.d', parseInt] }] }
    ])
];
X.tend({
    name: 'counter-mi',
    class: CounterMi,
    mainTemplate: mainTemplate,
    propActions: propActions,
    refs: refs
});
