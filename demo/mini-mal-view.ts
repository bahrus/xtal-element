import {XtalViewElement} from '../XtalRoomWithAView.js';
import {createTemplate} from 'trans-render/createTemplate.js';
import {PESettings} from 'trans-render/types.d.js';

const template = createTemplate(
    /* html */`<div></div>`
);

export class MinimalView extends XtalViewElement<[string, number]>{

    //#region Required Members
    readyToInit = true

    init(){
        return new Promise<[string, number]>(resolve =>{
            resolve(['Greetings, Earthling.', 0]);
        })
    }

    readyToRender = true;

    mainTemplate = template;
    
    initTransform = {
        div: [{}, {click: this.clickHandler}] as PESettings<HTMLDivElement>,
    };

    // update(){
    //     return new Promise<string>(resolve =>{
    //         resolve('That tickles, number ' + this.count);
    //     })
    // }
    
    updateTransform = () => ({
        div: `${this.viewModel[0]}  ${this.viewModel[1]}`,
    })
    //#endregion

    clickHandler(e: Event){
        this.viewModel[1]++;
        this.viewModel[0] = "Live long and prosper.";
        this.transform();
    }
        


}
customElements.define('mini-mal-view', MinimalView);