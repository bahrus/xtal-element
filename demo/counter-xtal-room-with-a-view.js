import { XtalRoomWithAView, define } from '../XtalRoomWithAView.js';
import { createTemplate } from 'trans-render/createTemplate.js';
const template = createTemplate(
/* html */ `<div></div>`);
export class CounterXtalRoomWithAView extends XtalRoomWithAView {
    constructor() {
        super(...arguments);
        this.readyToInit = true;
        this.initViewModel = ({}) => new Promise(resolve => {
            resolve(['Greetings, Earthling.', 0]);
        });
        this.readyToRender = true;
        this.mainTemplate = template;
        this.initTransform = {
            div: [{}, { click: this.clickHandler }],
        };
        this.updateTransforms = [
            ({ viewModel }) => ({
                div: `${this.viewModel[0]}  ${this.viewModel[1]}`
            })
        ];
        this.updateTransform = () => ({
            div: `${this.viewModel[0]}  ${this.viewModel[1]}`,
        });
    }
    clickHandler(e) {
        this.viewModel[1]++;
        this.viewModel[0] = "Live long and prosper.";
        this.onPropsChange('viewModel');
    }
}
CounterXtalRoomWithAView.is = 'counter-xtal-room-with-a-view';
define(CounterXtalRoomWithAView);
