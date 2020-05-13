# XtalElement

<details>
<summary>Target Audience</summary>

XtalElement is yet another base element to use for creating web components.  The great thing about web components is that they are the web equivalent of Martin Luther King's "I have a dream" speech.  Little web components built with tagged template literals can connect with little web components built with Elm, and web components will be judged by the content they provide, rather than superficial internal technical library choices. 

XtalElement adopts a number of "opinions" that may be best suited for some types of components / scenarios / developer preferences, but not everything.  

For example, an interesting duality paradox that has existed for a number of years has been between OOP vs functional programming.  Efforts to "embrace the duality paradox" like Scala and F# always appealed to me.  The "hooks" initiative adds an interesting twist to the debate, and might strike the right balance for some types of components.  Evidently, the result has been less boilerplate code, which can only be good.  Perhaps the learning curve is lower as well, and that's great.

XtalElement, though, sticks with classes, because of the way it makes it easy to extend code.  Much of what XtalElement is striving to do is in fact focused squarely on getting the most out of inheritance.

For example, it is often useful to build a base component that only uses primitive html elements built into the browser, as much as possible.  Then allow for extending classes to substitute the primitive html elements with the rapidly growing list of robust design libraries, in a kind of "lift and shift" approach.

Web components typically upgrade in two steps -- starting with the light children, and then blossoming into the rich interface once the dependencies are downloaded.  With the approach mentioned above, maybe it would be possible to add a third stage?  Just an unproven thought.

Anyway, XtalElement's target audience is those who are looking for a base class that:

1.  Will benefit from the implementation of HTML Modules -- the rendering library is focused around HTMLTemplateElement-based UI definitions, rather than JSX or tagged-template literals, to define the HTML structure.
2.  Takes extensibility to a whole other level.
3.  Provides first-class support for progressive enhancement, low bandwidth.
4.  Efforts made to reap the most out of TypeScript (but use is entirely optional).  The base class is an abstract class.  Typescript then highlights what you need to implement.  No need to memorize or look things up.
5.  Adopts the philosophy that it makes sense to keep the initialization process separate from the update process.  The initialization process typically involves doing one-time tasks, like cloning / importing HTML Templates, and attaching event handlers.  The update process focuses on passing in new data bindings as they change.  Keeping these two separate, and keeping the HTML Templates separate from binding mappings, may result in a bit more steps than other libraries, but hopefully the lack of magic /  increased flexibility(?) can pay off in some cases.

As we'll see, satisfying these requirements suggests creating a starting point that is a bit more complex than the primitive custom element definition.  This base library doesn't claim to be the best fit for all types of web components, but focuses on some common needs.

</details>

## What makes XtalElement different

1.  XtalElement uses the [trans-render](https://github.com/bahrus/trans-render) library for updating the UI as properties change.
2.  The separation of concerns that trans-render provides makes it possible to separate out the initial render from update renders.
3.  Even the update renders can be easily partitioned based on which properties changes.   Consider the following example:

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
    updateTransforms = [
        ({prop1}) =>{
            section:{
                h1: prop1
            }
        },
        ({prop1, prop2}) =>{
            section:{
                h2: prop1 + prop2
            }
        },
        ({prop1, prop3}) =>{
            footer: {
                h3: prop1 + prop3
            }
        },
        ({prop1, prop2, prop3}) => {
            footer:{
                h4: prop1 + prop2 + prop3
            }
        }
    }]
    onPropsChange(propName){
        ...//code that makes this happen properly
        this.transform()
    }
}
```

As long as all property changes also notify the onPropsChange method, specifying the name, then when prop1 changes, all 4 transformations are performed on the main template. When prop2 changes, only the second and last transforms need to be performed.  And when prop3 changes, only the third and fourth transformations are needed.


## Minimal XtalElement Setup

XtalElement is the base class, and doesn't provide support for asynchronous retrieval of a view model property.

Here is a minimal example of a web component that extends XtalElement:


```TypeScript
import {createTemplate} from 'trans-render/createTemplate.js';
import {interpolate} from 'trans-render/interpolate.js';
import {XtalElement, define} from '../XtalElement.js';
import {AttributeProps, TransformRules, SelectiveUpdate} from '../types.d.js';

const mainTemplate = createTemplate(/* html */`
<style>
.btn {
    font-size: 200%;
}
</style>
<button class="btn">Hello |.name ?? World|</slot></button>
<div></div>
`);
const buttonSym = Symbol();
export class MiniMal extends XtalElement{
    static is = 'mini-mal';
    static attributeProps = ({disabled, name} : MiniMal) => ({
        boolean: [disabled],
        string: [name],
    }  as AttributeProps);
    //This property / field allows the developer to wait for some required 
    //properties to be set before doing anything.
    readyToInit = true;

    //Until readyToRender is set to true, the user will see the light children (if using Shadow DOM).
    //You can return true/false.  You can also indicate the name of an alternate template to clone (mainTemplate is the default property for the main template)
    readyToRender = true;

    //XtalElement is intended for visual elements only.
    //Templates need to be stored outside instances of web components for 
    //optimal performance
    mainTemplate = mainTemplate;

    
    [buttonSym]: HTMLButtonElement;
    //uses trans-render syntax: https://github.com/bahrus/trans-render
    //initTransform is only done once.
    initTransform = {
        button: [,{click: () => {this.name = 'me'}},,,buttonSym],
    } as TransformRules;

    // updateTransforms is called anytime property "name" changes.
    // Any other property changes won't trigger an update, as there is no
    // arrow function in array with any other property name.
    updateTransforms = [
        ({name} : MiniMal) => ({
            [buttonSym]: ({target}) => interpolate(target, 'textContent', this, false),
        }) as TransformRules
    ] as SelectiveUpdate[];

    name: string | undefined;
}
define(MiniMal);

```

## Inheritance overindulgence?

By leveraging css-based transformations, subclasses which override the transformations have fairly free reign.  But probably no more so than more traditional class based components (which can override render and do whatever it pleases).  This is largely a symptom of lack of a "final" keyword for properties and methods, even within TypeScript.

But what XtalElement is guilty of, perhaps, is making it more tempting to take great liberties with the original UI.  XtalElement, by design, tries to make it easy to tweak the rendered output, compared with more traditional rendering methods.  

XtalElement's template processing can still benefit from standard inheritance, in the sense that transformation branches can be defined within a method, and that method can be overridden, which is all fine and good.  But XtalElement allows an easy way to amend *any* part of the document easily, not just specially marked sections from the base class.

To make this even easier, XtalElement allows a chain to be set up during initialization of the component.  The benefits of this are much stronger with initialization, because during that time, nothing has been added to the DOM tree, hence alterations are fairly low cost and best done ahead of time.

In particular, a subclass can add the following method:

```TypeScript
initRenderCallback(ctx: RenderContext, target: HTMLElement | DocumentFragment){}
afterUpdateRenderCallback(ctx: RenderContext, target: HTMLElement | DocumentFragment, renderOptions: RenderOptions | undefined){}
```

**NB**  This kind of css-based inheritance chain that XtalElement provides probably shouldn't go too many levels deep.  I.e. a vendor provides a default UI, which a consumer can tweak, essentially.  But having a chain of independent, loosely coupled third party developers inheriting in this manner seems like it could lend itself to some significant fragility.

## A room with a view 

I suspect that many (most?) components today tend to have a one-to-one mapping between a component and a business domain object fetched via some promise-based Rest / GraphQL / (SOAP?) api.  XtalRoomWithAView provides help to provide a pattern for doing this, in such a way that the light children will continue to display until such a time as there's something better to see than the light children.  

XtalRoomWithAView extends XtalElement, but in addition it keeps track of the "state" the component is in -- i.e. initializing, updating, and also providing support for [aborting](https://cameronnokes.com/blog/cancelling-async-tasks-with-abortcontroller/) requests when the parameters change while in mid-flight[TODO].

I am hoping that the [custom state pseudo class proposal](https://www.chromestatus.com/feature/6537562418053120) will continue to gain some momentum, which empowers developers with some of the same machinery available to browser vendors when they implement internal components.  If it does, XtalRoomWithAView will certainly take advantage of that promising sounding feature. 

For now, XtalRoomWithAView also conveys state changes via data-* attributes. The attribute changes will likely be removed once (if?) the proposal above lands[TODO].

XtalRoomWithAView also supports something that may only be applicable 33.7% of the time.  Recall that XtalElement sees a strong case separating initialization from updating, as far as rendering. Likewise, sometimes what you need to retrieve originally may differ from what needs to be retrieved subsequently.

For example, a component might want to retrieve the data required for the main view, which may be a chart or a grid.  But also, with the same data call, retrieve the data required for dropdown filters that allow for updating the main view.  Performance / maintainability considerations might make it prudent to combine the data retrieval for both the filters and the main view together in one call, especially if the filters share some of the same data as the filters. But once the original view is rendered, now as the filters change via user interaction, we only want to retrieve the data needed for the grid or chart, but not for the filters. 

In addition, the kind of component we are discussing generally always needs to display an initial view once enough parameters are set.

Whereas the update should only occur when a subset of the parameters in the "room" change.

It is for this reason that a separate update protocol is provided. 

The code below shows the minimal amount of code needed to define a custom element using this library.  If you are using TypeScript, it won't compile until some code is placed in many of the properties / methods below.

## Minimal XtalViewElement Setup

```TypeScript
import {XtalViewElement} from '../xtal-view-element.js';
import {createTemplate} from 'trans-render/createTemplate.js';
import {PESettings} from 'trans-render/init.d.js';

const template = createTemplate(
        `<div></div>`
);

export class MinimalView extends XtalViewElement<string>{

    //#region Required Members
    readyToInit = true

    initViewModel(){
        return new Promise<string>(resolve =>{
            resolve('Greetings, Earthling.');
        })
    }

    readyToRender = true;

    updateViewModel(){
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



## Built-in decorator Transformers

