import { CounterXtalElement } from './counter-xtal-element.js';
import { define } from '../XtalElement.js';
export class ExtendingClass extends CounterXtalElement {
}
ExtendingClass.is = 'extending-class';
ExtendingClass.attributeProps = ({}) => ({});
define(ExtendingClass);
