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
const refs = { buttonElements: '', spanElement: '' };
const propActions = [
    ({ domCache, self }) => [
        { [refs.buttonElements]: [, { click: [self.changeCount, 'dataset.d', parseInt] }] }
    ],
    ({ domCache, count }) => [
        { [refs.spanElement]: count }
    ]
];
export class CounterMi extends X {
    constructor() {
        super(...arguments);
        this.count = 0;
    }
    changeCount(delta) {
        this.count += delta;
    }
}
X.tend({
    name: 'counter-mi',
    class: CounterMi,
    mainTemplate,
    propActions,
    refs
});
