import {createTemplate} from 'trans-render/createTemplate.js';
import {XtalElement, define} from '../XtalElement.js';
import {AttributeProps} from '../types.js';
import {PESettings} from 'trans-render/types.d.js';

const mainTemplate = createTemplate(/* html */`
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
export class CounterXtalElement extends XtalElement{
    //Name of custom element
    static is = 'counter-xtal-element';

    //Properties / attributes spelled out so reflection can auto generate
    //needed code
    static attributeProps = ({count} : CounterXtalElement) => ({
        num: [count]
    }  as AttributeProps);

    //This property / field allows the developer to wait for some required 
    //properties to be set before doing anything.
    readyToInit = true;

    //Until readyToRender is set to true, the user will see the light children (if using Shadow DOM).
    //You can return true/false.  You can also indicate the name of an alternate template to clone (mainTemplate is the default property for the main template)
    readyToRender = true;

    //XtalElement is intended for visual elements only.
    //Templates need to be stored outside instances of web components for 
    //optimal performance
    mainTemplate = mainTemplate;

    
    [span$]: HTMLSpanElement;
    //uses trans-render syntax: https://github.com/bahrus/trans-render
    //initTransform is only done once.
    initTransform = {
        button:[,{click:[this.changeCount, 'dataset.d', parseInt]}] as PESettings<CounterXtalElement>,
        span: span$,
    };

    // updateTransforms is called anytime property "name" changes.
    // Any other property changes won't trigger an update, as there is no
    // arrow function in array with any other property name.
    updateTransforms = [ 
        ({count}: CounterXtalElement) => ({[span$]: count.toString()})
    ];

    count = 0;

    changeCount(delta: number){
        this.count += delta;
    }
    
}
define(CounterXtalElement);
