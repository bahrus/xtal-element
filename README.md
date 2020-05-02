# xtal-element

<details>
<summary>Target Audience</summary>

xtal-element is yet another base element to use for creating web components.  The great thing about web components is that they are the web equivalent of Martin Luther King's "I have a dream" speech.  Little web components built with tagged template literals can connect with little web components built with Elm, and web components will be judged by the content they provide, rather than superficial internal technical library choices. 

xtal-element adopts a number of "opinions" that may be best suited for some types of components / scenarios / developer preferences, but not everything.  

For example, an interesting duality paradox that has existed for a number of years has been between OOP vs functional programming.  Efforts to "embrace the duality paradox" like Scala and F# always appealed to me.  The "hooks" initiative adds an interesting twist to the debate, and might strike the right balance for some types of components.  Evidently, the result has been less boilerplate code, which can only be good.  Perhaps the learning curve is lower as well, and that's great.

xtal-element, though, sticks with classes, because of the way it makes it easy to extend code.  Much of what xtal-element is striving to do is in fact focused squarely on getting the most out of inheritance.

For example, it is often useful to build a base component that only uses primitive html elements built into the browser, as much as possible.  Then allow for extending classes to substitute the primitive html elements with the rapidly growing list of robust design libraries, in a kind of "lift and shift" approach.

Web components typically upgrade in two steps -- starting with the light children, and then blossoming into the rich interface once the dependencies are downloaded.  With the approach mentioned above, maybe it would be possible to add a third stage?  Just an unproven thought.

Anyway, xtal-element's target audience is those who are looking for a base class that:

1.  Will benefit from the implementation of HTML Modules -- The default rendering library is focused around HTMLTemplateElement-based UI definitions, rather than JSX or tagged-template literals, to define the HTML structure.
2.  Takes extensibility to a whole other level.
3.  Provides first-class support for progressive enhancement, low bandwidth.
4.  Efforts made to reap the most out of TypeScript (but use is entirely optional).  The base class is an abstract class.  Typescript then highlights what you need to implement.  No need to memorize or look things up.
5.  Adopts the philosophy that it makes sense to keep the initialization process separate from the update process.  The initialization process typically involves doing one-time tasks, like cloning / importing HTML Templates, and attaching event handlers.  The update process focuses on passing in new data bindings as they change.  Keeping these two separate, and keeping the HTML Templates separate from binding mappings, may result in a bit more steps than other libraries, but hopefully the lack of magic / flexibility can pay off in some cases.

As we'll see, satisfying these requirements suggests creating a starting point that is a bit more complex than the primitive custom element definition.  This base library doesn't claim to be the best fit for all types of web components, but focuses on some common needs.

</details>

## Minimal XtalElement Setup

XtalElement is the base class, and doesn't provide support for asynchronous retrieval of a view model property.

Here is a minimal example of a web component that extends XtalElement:

```TypeScript
import {createTemplate} from 'trans-render/createTemplate.js';
import {TransformRules, TransformValueOptions, } from 'trans-render/types.d.js';
import {interpolate} from 'trans-render/interpolate.js';
import {XtalElement} from 'xtal-element/xtal-element.js';

const mainTemplate createTemplate(/* html */`
    <style>
    .btn {
        font-size: 200%;
    }
    </style>
    <button class="btn">Hello |.name ?? World|</slot></button>
`;
const name = 'name';
export class MiniMal extends XtalElement{

    //This property / field allows the developer to wait for some required properties to be set before doing anything.
    readyToInit = true;

    //Until readyToRender is set to true, the user will see the light children (if using Shadow DOM).
    //You can return true/false.  You can also indicate the name of an alternate template to clone (mainTemplate is the default property for the main template)
    readyToRender = true;


    mainTemplate = mainTemplate;

    //uses trans-render syntax: https://github.com/bahrus/trans-render
    //initTransform is only done once.
    initTransform = {
        button: [{},{click: () => {this.name = 'me'}}]
    } as TransformRules;

    // updateTransform is called anytime 
    // this.attr(name, value) or this.onPropsChange(name)
    updateTransform = {
        button: ({target}) => interpolate(target, 'textContent', this, false),
    } as TransformRules;
    
    //Close to the metal boilerplate.  Leaving as is, waiting (im)patiently for Godot (decorators) 
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
    
}
customElements.define('mini-mal', MiniMal);
```

## TODO:  Updates based on property name change:

```JavaScript
mainTemplate = createTemplate(/* html */`
    <section>
        <h1></h1>
        <h2></h2>
    </section>
    <footer>
        <h3></h3>
        <h4></h4>
    </footer>
`);

export class Foo extends XtalElement{
    prop1 = 'a';
    prop2 = 'b';
    prop3 = 'c';
    selectiveUpdatesTransform = [
        ({prop1}) =>{
            section:{
                h1: prop1
            }
        }
        ({prop1, prop2}) =>{
            section:{
                h2: prop1 + prop2
            }
        }
        ({prop1, prop3}) =>{
            footer: {
                h3: prop1 + prop3
            }
        }
        ({prop1, prop2, prop3}){
            footer:{
                h4: prop1 + prop2 + prop3
            }
        }
    }]
}
```

When prop1 changes, all 4 transformations are performed on , when prop2 changes, only the second and last, and when prop3 changes, do the third and last transformations.

## Inheritance -- tentative, rambling, TODO

By leveraging css-based transformations, subclasses which override the transformations have fairly free reign.  But probably no more so than more traditional class based components (which can override render and do whatever one pleases).  This is largely a symptom of lack of a "final" keyword for properties and methods, even within TypeScript.

But what XtalElement is guilty of, perhaps, is making it more tempting to take great liberties with the original UI.  XtalElement, by design, much easier to do tweak the rendered output, than with more traditional rendering methods.  

XtalElement's template processing can benefit from standard inheritance, in the sense that transformation branches can be defined within a method, and that method can be overridden, which is all fine and good.  But XtalElement allows an easy way amend any part of the document.

To make this even easier, XtalElement allows a chain to be set up during initialization of the component (but not updates for now).  The benefits of this are much strong with initialization, because during that time, nothing has been added to the DOM tree, hence alterations are fairly low cost.

In particular, a subclass can add the following method:

```TypeScript
initRenderCallback(ctx: RenderContext, target: HTMLElement | DocumentFragment){}
```

**NB**  This kind of css-based inheritance chain that XtalElement provides probably shouldn't go too many levels deep.  I.e. a Vendor provides a default UI, which a consumer can tweak, essentially.  But having a chain of independent, loosely coupled third party developers inheriting in this manner seems like it could lend itself to some significant fragility.

## Minimal XtalViewElement Setup

The code below shows the minimal amount of code needed to define a custom element using this library, without any non optimal corner cutting.  If you are using TypeScript, it won't compile until some code is placed in many of the properties / methods below.

```TypeScript
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

    update(){
        return new Promise<string>(resolve =>{
            resolve('That tickles, number ' + this.count);
        })
    }

    mainTemplate = template;
    
    initTransform = {
        div: [{}, {click: this.clickHandler}] as PESettings<HTMLDivElement>,
    };
    

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
```

## Boilerplate Busting



## Progressive Enhancement Support

Quite often, a web component, after initializing, needs to retrieve some entity before it can really render anything meaningful.  In the meantime, perhaps we want to display something, like a loading mask and or a summary of what the component is showing.  That means using light children, that, only when we have something better to show, should display. 

## Build-in decorator Transformers

