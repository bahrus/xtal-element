import {XtalViewElement} from '../xtal-view-element.js';
import {createTemplate} from '../utils.js';
import {init} from 'trans-render/init.js';
import {update} from 'trans-render/update.js';
import { RenderContext } from 'trans-render/init.d.js';
import {newEventContext} from 'event-switch/event-switch.js';
import {EventContext} from 'event-switch/event-switch.d.js';
const template = createTemplate(/* html */`<div></div>`);
export class MinimalView extends XtalViewElement<string>{

    _eventSwitchContext  = newEventContext({
        click: e => this.onPropsChange()
    });

    get eventSwitchContext() {
        return this._eventSwitchContext;
    }

    _renderContext = {
        init: init,
        Transform:{
            div: x=> this.viewModel
        }
    } as RenderContext;
    get renderContext(){
        return this._renderContext;
    }
        
    async init(){
        return new Promise<string>(resolve =>{
            resolve('Greetings, Earthling.');
        })
    }
    async update(){
        this.renderContext.update = update;
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