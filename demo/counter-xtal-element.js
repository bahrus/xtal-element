import { createTemplate } from 'trans-render/createTemplate.js';
import { XtalElement, define } from '../XtalElement.js';
const mainTemplate = createTemplate(/* html */ `
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
`);
const span$ = Symbol('spanSym');
/**
 * @element counter-xtal-element
 */
let CounterXtalElement = /** @class */ (() => {
    class CounterXtalElement extends XtalElement {
        constructor() {
            super(...arguments);
            //This property / field allows the developer to wait for some required 
            //properties to be set before doing anything.
            //A check is made to this field / getter property anytime a declared property changes.
            this.readyToInit = true;
            //Until readyToRender is set to true, the user will see the light children (if using Shadow DOM).
            //You can return true/false.  You can also indicate the name of an alternate template to clone (mainTemplate is the default property for the main template)
            //A check is made to this field / getter property anytime a declared property changes.
            this.readyToRender = true;
            //XtalElement is intended for visual elements only.
            //Templates need to be stored outside instances of web components for 
            //optimal performance
            this.mainTemplate = mainTemplate;
            //uses trans-render syntax: https://github.com/bahrus/trans-render
            //initTransform is only done once.
            this.initTransform = {
                button: [, { click: [this.changeCount, 'dataset.d', parseInt] }],
                span: span$,
            };
            // updateTransforms is called anytime property "name" changes.
            // Any other property changes won't trigger an update, as there is no
            // arrow function in array with any other property name.
            this.updateTransforms = CounterXtalElement.updateTransforms;
        }
        changeCount(delta) {
            this.count += delta;
        }
    }
    //Name of custom element
    CounterXtalElement.is = 'counter-xtal-element';
    //Properties / attributes spelled out so reflection can auto generate
    //needed code
    CounterXtalElement.attributeProps = ({ count }) => ({
        num: [count]
    });
    CounterXtalElement.updateTransforms = [
        ({ count }) => ({ [span$]: count.toString() })
    ];
    CounterXtalElement.defaultValues = {
        count: 30
    };
    return CounterXtalElement;
})();
export { CounterXtalElement };
define(CounterXtalElement);
