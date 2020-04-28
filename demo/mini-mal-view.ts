import {XtalViewElement} from '../xtal-view-element.js';
import {createTemplate} from 'trans-render/createTemplate.js';
import {PESettings} from 'trans-render/init.d.js';

const template = createTemplate(
    /* html */`<div></div>`
);

export class MinimalView extends XtalViewElement<string>{

    //#region Required Members
    readyToInit = true

    init(){
        return new Promise<string>(resolve =>{
            resolve('Greetings, Earthling.');
        })
    }

    readyToRender = true;

    mainTemplate = template;
    
    initTransform = {
        div: [{}, {click: this.clickHandler}] as PESettings<HTMLDivElement>,
    };

    update(){
        return new Promise<string>(resolve =>{
            resolve('That tickles, number ' + this.count);
        })
    }
    
    updateTransform = () => ({
        div: this.viewModel,
    })
    //#endregion

    clickHandler(e: Event){
        this.inc();
    }

    #count = 0;
    get count(){
        return this.#count;
    }
    set count(nv){
        this.#count = nv;
        this.onPropsChange();
    }
    inc(){
        this.count++;
    }
        


}
customElements.define('mini-mal-view', MinimalView);