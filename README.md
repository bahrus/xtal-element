# xtal-element

xtal-element is yet another base element to use for creating web components.  The great thing about web components is that they are the web equivalent of Martin Luther King's "I have a dream" speech.  Little web components built with tagged template literals can connect with little web components built with Elm, and web components will be judged by the content they provide, rather than superficial internal technical library choices. 

xtal-element's target audience is those who are looking for a base class that:

1.  Will benefit from the implementation of HTML Modules -- The default rendering library is focused around HTMLTemplateElement-based UI definitions, rather than JSX or tagged-literals, to define the HTML structure.  It out polymers Polymer!
2.  Takes extensibility to a whole other level.
3.  Provides first-class support for progressive enhancement, low bandwidth.
4.  Efforts made to reap the most out of TypeScript (but use is entirely optional).  The base class is an abstract class.  Typescript then highlights what you need to implement.  No need to memorize or look things up.
5.  Views web components as a mix between a kind of declarative function -- a function of its properties/attributes.  And as a view based on a view model.  Focus is on web components that create a logical, and optionally visual output of these properties / attributes.

As we'll see, satisfying these requirements suggests creating a starting point that is a bit more complex than the primitive custom element definition.  This base library doesn't claim to be the best fit for all types of web components, but focuses on some common needs.

## Minimal Setup

The code below shows the minimal amount of code needed to define a custom element using this library without any non optimal corner cutting..  If you are using TypeScript, it won't compile until some code is placed in many of the properties / methods below.

```TypeScript
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
                click:{
                    action: (e: Event, ctx: EventSwitchContext) => {
                        this.onPropsChange();
                    }
                }
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
```

## Progressive Enhancement Support

Quite often, a web component, after initializing, needs to retrieve some entity before it can really render anything meaningful.  In the meantime, perhaps we want to display something, like a loading mask and or a summary of what the component is showing.  That means using light children, that, only when we have someting better to show, should dis[lay. 

