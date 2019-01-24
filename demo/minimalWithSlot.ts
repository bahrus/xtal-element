import {XtalElement} from '../xtal-element.js';
import {createTemplate} from '../utils.js';
import {init} from 'trans-render/init.js';
import {update} from 'trans-render/update.js';
import { RenderContext } from 'trans-render/init.d.js';
import {addEventListeners} from 'event-switch/event-switch.js';
import {EventSwitchContext} from 'event-switch/event-switch.d.js';
const template = createTemplate(/* html */`<div>
</div>
<slot name="test"></slot>
<style>
    div{
        cursor:pointer;
    }
</style>
`);
export class Minimal extends XtalElement<string>{

    _eventSwitchContext  = {
        addEventListeners: addEventListeners,
        eventSwitch:{
            click: e => this.onPropsChange(),
            slotchange: e =>{
                console.log('in slot change');
            }
        },
    } as EventSwitchContext;

    get eventSwitchContext() {
        return this._eventSwitchContext;
    }

    _renderContext = {
        init: init,
        transform:{
            div: x=> this.viewModel
        }
    } as RenderContext;
    get renderContext(){
        return this._renderContext;
    }
        
    async init(){
        return new Promise<string>(resolve =>{
            resolve('👽 Greetings, Earthling. 👽');
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
customElements.define('mini-mal', Minimal);