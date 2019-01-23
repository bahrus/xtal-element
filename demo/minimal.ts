import {XtalElement} from '../xtal-element.js';
import {createTemplate} from '../utils.js';
import {init} from 'trans-render/init.js';
import { RenderContext } from 'trans-render/init.d.js';
const template = createTemplate(/* html */`<div></div>`);
export class Minimal extends XtalElement<string>{
    get eventSwitchContext() {
        return {};
    }
    get renderContext(){
        return {
            init: init,
            transform:{
                div: x=> this.viewModel
            }
        } as RenderContext;
    }
    async init(){
        return new Promise<string>(resolve =>{
            resolve('Greetings, Earthling.');
        })
    }
    async update(){
        this.root.innerHTML = '';
        return this.init();
    }
    get mainTemplate(){
        return template;
    }
    get ready(){return true;}
}
customElements.define('mini-mal', Minimal);