import {XtalViewElement} from '../xtal-view-element.js';
import {createTemplate, newRenderContext} from '../utils.js';
import {update} from 'trans-render/update.js';
import {newEventContext} from 'event-switch/event-switch.js';
const template = createTemplate(/* html */`<div></div>`);

export class MinimalView extends XtalViewElement<string>{

    _eventContext  = newEventContext({
        click: e => this.onPropsChange()
    });

    get eventContext() {
        return this._eventContext;
    }

    _renderContext = newRenderContext({
            div: x=> this.viewModel
    })
    get initContext(){
        return this._renderContext;
    }
        
    async init(){
        return new Promise<string>(resolve =>{
            resolve('Greetings, Earthling.');
        })
    }
    async update(){
        this.initContext.update = update;
        return new Promise<string>(resolve =>{
            resolve('That tickles.');
        })
    }
    get mainTemplate(){
        return template;
    }
    get ready(){return true;}
}
customElements.define('mini-mal-view', MinimalView);