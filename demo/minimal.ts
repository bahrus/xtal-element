import {XtalElement} from '../xtal-element.js';
import {createTemplate} from '../utils.js';
import {init} from 'trans-render/init.js';
import {update} from 'trans-render/update.js';
import { RenderContext } from 'trans-render/init.d.js';
import {addEventListeners} from 'event-switch/event-switch.js';
import {EventSwitchContext} from 'event-switch/event-switch.d.js';
const template = createTemplate(/* html */`<div></div>`);
export class Minimal extends XtalElement<string>{
    get eventSwitchContext() {
        return {
            addEventListeners: addEventListeners,
            eventSwitch:{
                click: e => this.onPropsChange(),
                // click:{
                //     action: (e: Event, ctx: EventSwitchContext) => {
                //         this.onPropsChange();
                //     }
                // }
            }

        } as EventSwitchContext;
    }
    _renderContext : RenderContext | null = null;
    get renderContext(){
        if(this._renderContext === null){
            this._renderContext = {
                init: init,
                transform:{
                    div: x=> this.viewModel
                }
            }
        }
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
customElements.define('mini-mal', Minimal);