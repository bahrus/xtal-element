import {CounterXtalElement} from './counter-xtal-element.js';
import {define} from '../XtalElement.js';

export class ExtendingClass extends CounterXtalElement {
    static is = 'extending-class';
    static attributeProps = ({}: ExtendingClass) => ({

    });
}
define(ExtendingClass);