import {XtalViewElement} from '../xtal-view-element.js';
import {createTemplate} from 'trans-render/createTemplate.js';
import {PESettings} from 'trans-render/init.d.js';

const template = createTemplate(
    /* html */`<div></div>`
);

export class MinimalView extends XtalViewElement<string>{

    get initTransform(){
        return {
            div: [{}, {click: this.clickHandler}] as PESettings<HTMLDivElement>,
        }
    }

    get updateTransform(){
        return {
            div: this.viewModel
        }
    }

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
        
    init(){
        return new Promise<string>(resolve =>{
            resolve('Greetings, Earthling.');
        })
    }
    update(){
        return new Promise<string>(resolve =>{
            resolve('That tickles number ' + this.count);
        })
    }
    get mainTemplate(){
        return template;
    }
    get readyToInit(){return true;}
}
customElements.define('mini-mal-view', MinimalView);