import { X } from '../legacy/X.js';
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
export const CounterXMixin = (Base) => class extends Base {
    constructor() {
        super(...arguments);
        this.count = 0;
    }
    changeCount(delta) {
        this.count += delta;
    }
};
const [span$] = [Symbol('span')];
X.cessorize({
    name: 'counter-xs',
    mixins: [CounterXMixin],
    main: template,
    attributeProps: ({ count }) => ({ num: [count] }),
    initTransform: ({ changeCount }) => ({
        button: [{}, { click: [changeCount, 'dataset.d', parseInt] }],
        span: span$,
    }),
    updateTransforms: [({ count }) => ({ [span$]: count.toString() })]
});
