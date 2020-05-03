import { XtalViewElement } from '../XtalRoomWithAView.js';
import { createTemplate } from 'trans-render/createTemplate.js';
const template = createTemplate(
/* html */ `<div></div>`);
export class MinimalView extends XtalViewElement {
    constructor() {
        super(...arguments);
        //#region Required Members
        this.readyToInit = true;
        this.readyToRender = true;
        this.mainTemplate = template;
        this.initTransform = {
            div: [{}, { click: this.clickHandler }],
        };
        // update(){
        //     return new Promise<string>(resolve =>{
        //         resolve('That tickles, number ' + this.count);
        //     })
        // }
        this.updateTransform = () => ({
            div: `${this.viewModel[0]}  ${this.viewModel[1]}`,
        });
    }
    init() {
        return new Promise(resolve => {
            resolve(['Greetings, Earthling.', 0]);
        });
    }
    //#endregion
    clickHandler(e) {
        this.viewModel[1]++;
        this.viewModel[0] = "Live long and prosper.";
        this.transform();
    }
}
customElements.define('mini-mal-view', MinimalView);
