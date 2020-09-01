import {XtalRoomWithAView, define} from '../XtalRoomWithAView.js';
import {createTemplate} from 'trans-render/createTemplate.js';
import {TransformValueOptions, PESettings} from '../types.js';

const template = createTemplate(
    /* html */`<div></div>`
);

export class CounterXtalRoomWithAView extends XtalRoomWithAView<[string, number]>{

    static is = 'counter-xtal-room-with-a-view';

    readyToInit = true

    initViewModel = ({}) => new Promise<[string, number]>(resolve =>{
        resolve(['Greetings, Earthling.', 0]);
    })

    readyToRender = true;

    mainTemplate = template;
    
    initTransform = {
        div: [{}, {click: this.clickHandler}] as PESettings<HTMLDivElement>,
    };

    updateTransforms = [
        ({viewModel} : CounterXtalRoomWithAView) => ({
            div: `${this.viewModel[0]}  ${this.viewModel[1]}`
        })  as TransformValueOptions
    ];
    
    updateTransform = () => ({
        div: `${this.viewModel[0]}  ${this.viewModel[1]}`,
    })

    clickHandler(e: Event){
        this.viewModel[1]++;
        this.viewModel[0] = "Live long and prosper.";
        this.onPropsChange('viewModel');
    }

}
define(CounterXtalRoomWithAView);