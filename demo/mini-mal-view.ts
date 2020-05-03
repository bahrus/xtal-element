import {XtalRoomWithAView} from '../XtalRoomWithAView.js';
import {TransformRules, PESettings} from 'trans-render/types.d.js';
import {createTemplate} from 'trans-render/createTemplate.js';
import {SelectiveUpdate} from '../XtalElement.js';

const template = createTemplate(
    /* html */`<div></div>`
);

export class MinimalView extends XtalRoomWithAView<[string, number]>{

    readyToInit = true

    initView = ({}) => new Promise<[string, number]>(resolve =>{
        resolve(['Greetings, Earthling.', 0]);
    })

    readyToRender = true;

    mainTemplate = template;
    
    initTransform = {
        div: [{}, {click: this.clickHandler}] as PESettings<HTMLDivElement>,
    };

    selectiveUpdateTransforms = [
        ({viewModel} : MinimalView) => ({
            div: `${this.viewModel[0]}  ${this.viewModel[1]}`
        })  as TransformRules
    ]  as SelectiveUpdate[];
    
    updateTransform = () => ({
        div: `${this.viewModel[0]}  ${this.viewModel[1]}`,
    })

    clickHandler(e: Event){
        this.viewModel[1]++;
        this.viewModel[0] = "Live long and prosper.";
        this.onPropsChange('viewModel');
    }
        


}
customElements.define('mini-mal-view', MinimalView);