# xtal-element

xtal-element is yet another base element to use for creating web components.  The great thing about web components is that they are the web equivalent of Martin Luther King's "I have a dream" speech.  Little web components built with tagged template literals can connect with little web components built with Elm, and web components will be judged by the content they provide, rather than superficial internal technical library choices. 

xtal-element's target audience is those who are looking for a base class that:

1.  Will benefit from the implementation of HTML Modules -- The default rendering library is focused around HTMLTemplateElement-based UI definitions, rather than JSX or tagged-template literals, to define the HTML structure.
2.  Takes extensibility to a whole other level.
3.  Provides first-class support for progressive enhancement, low bandwidth.
4.  Efforts made to reap the most out of TypeScript (but use is entirely optional).  The base class is an abstract class.  Typescript then highlights what you need to implement.  No need to memorize or look things up.
5.  Views web components as a mix between a kind of declarative function -- a function of its properties/attributes.  And as a view based on a view model.  Focus is on web components that create a logical, and optionally visual output of these properties / attributes.

As we'll see, satisfying these requirements suggests creating a starting point that is a bit more complex than the primitive custom element definition.  This base library doesn't claim to be the best fit for all types of web components, but focuses on some common needs.

xtal-element adopts the philosophy that it makes sense to keep the initialization process separate from the update process.  The initialization process typically involves doing one-time tasks, like cloning / importing HTML Templates, and attaching event handlers.  The update process focuses on passing in new data bindings as they change.  Keeping these two separate, and keeping the HTML Templates separate from binding mappings, may result in a bit more steps than other libraries, but hopefully the lack of magic / flexibility can pay off in some cases.

## Minimal XtalElement Setup

XtalElement is the base class, and doesn't provide support for asynchronous retrieval of a view model property.

Here is a minimal example of a web component that extends XtalElement:

```TypeScript
import {createTemplate} from 'trans-render/createTemplate.js';
import {TransformRules} from 'trans-render/init.d.js';
import {interpolate} from 'trans-render/interpolate.js';
import {XtalElement} from '../xtal-element.js';

const main = Symbol();
const name = 'name';
export class MiniMal extends XtalElement{

    //#region Required Members
    get readyToInit(){return true;}
    get readyToRender(){return true;}

    get mainTemplate(){return createTemplate(/* html */`
        <style>
        .btn {
            font-size: 200%;
        }
        </style>
        <button class="btn">Hello |.name ?? World|</slot></button>
    `, MiniMal, main)};

    get initTransform(){ 
        return {
            button: [{},{click: this.clickHandler}]
        } as TransformRules
    };

    #updateTransform = {
        button: ({target}) => interpolate(target, 'textContent', this, false),
    } as TransformRules;
    get updateTransform(){
        return this.#updateTransform;
    }
    //#endregion

    clickHandler(e: Event){
        this.name = 'me';
    }

    //#region boilerplate code
    #name!: string;
    get name(){
        return this.#name;
    }
    set name(nv){
        this.attr(name, nv);
    }
    connectedCallback(){
        this.propUp([name]);
        super.connectedCallback();
    }
    static get observedAttributes(){
        return super.observedAttributes.concat([name]);
    }
    attributeChangedCallback(name: string, oldVal: string, newVal: string){
        switch(name){
            case name:
                this.#name = newVal;
                break;
        }
        this.onPropsChange();
    }
    //#endregion
}
customElements.define('mini-mal', MiniMal);
```

## Minimal XtalViewElement Setup

The code below shows the minimal amount of code needed to define a custom element using this library, without any non optimal corner cutting.  If you are using TypeScript, it won't compile until some code is placed in many of the properties / methods below.

```TypeScript
import {XtalElement} from './xtal-element.js';

export abstract class XtalViewElement<ViewModel> extends XtalElement{
    
    abstract async init(signal: AbortSignal) : Promise<ViewModel>;

    abstract async update(signal: AbortSignal) : Promise<ViewModel>;


    constructor(){
        super();
        this.#state = 'constructed';
        this.#controller = new AbortController();
        this.#signal = this.#controller.signal
    }

    _viewModel!: ViewModel;
    get viewModel(){
        return this._viewModel;
    }
    set viewModel(nv: ViewModel){
        this._viewModel = nv;
        this.de('view-model', {
            value: nv
        });
        this.transRender();
    }

    #state: 'constructed' | 'initializing' | 'initialized' | 'updating' | 'updated' | 'initializingAborted' | 'updatingAborted';
    #controller: AbortController;
    #signal: AbortSignal;

    onPropsChange(): boolean {
        if(super._disabled || !this._connected || !this.readyToInit) return false;
        switch(this.#state){
            case 'constructed':
                this.init(this.#signal).then(model =>{
                    this.viewModel = model;
                    this.#state = 'initialized';
                });
                this.#state = 'initializing';
            case 'updating':
            case 'initializing':
                //todo: abort
                break; 
            case 'updated':
            case 'initialized':
                this.update(this.#signal).then(model =>{
                    this.viewModel = model;
                    this.#state = 'updated';
                })   
        }
        return true;


    }
}
```

## Progressive Enhancement Support

Quite often, a web component, after initializing, needs to retrieve some entity before it can really render anything meaningful.  In the meantime, perhaps we want to display something, like a loading mask and or a summary of what the component is showing.  That means using light children, that, only when we have something better to show, should display. 

