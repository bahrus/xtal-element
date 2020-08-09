import { X } from '../X.js';
const template = /* html */ `
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
export class CounterX extends X {
    constructor() {
        super(...arguments);
        this.count = 0;
    }
    changeCount(delta) {
        this.count += delta;
    }
}
X.tend({
    name: 'counter-x',
    class: CounterX,
    main: template,
    attributeProps: ({ count }) => ({ num: [count] }),
    initTransform: ({ changeCount }) => ({
        button: [{}, { click: [changeCount, 'dataset.d', parseInt] }],
        span: span$,
    }),
    updateTransforms: [({ count }) => ({ [span$]: count.toString() })]
});
