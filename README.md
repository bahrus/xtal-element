# xtal-element

<details>
<summary>Target Audience</summary>

xtal-element provides a handful of opinionated base classes for creating web components.  The great thing about web components is that they are the web equivalent of Martin Luther King's "I have a dream" speech.  Little web components built with tagged template literals can connect with little web components built with Elm, and web components will be judged by the content they provide, rather than superficial internal technical library choices. 

xtal-element adopts a number of "opinions" that may be best suited for some types of components / scenarios / developer preferences, but not everything.  

For example, an interesting duality paradox that has existed for a number of years has been between OOP vs functional programming.  Efforts to "embrace the duality paradox" like Scala and F# always appealed to me.  The "hooks" initiative adds an interesting twist to the debate, and might strike the right balance for some types of components.  Evidently, the result has been less boilerplate code, which can only be good.  Perhaps the learning curve is lower as well, and that's great.

xtal-element, though, mostly sticks with classes, because of the way it makes it easy to extend code.  Much of what XtalElement is striving to do is in fact focused squarely on getting the most out of inheritance.

For example, it is often useful to build a base component that only uses primitive html elements built into the browser, as much as possible.  Then allow for extending classes to substitute the primitive html elements with the rapidly growing list of robust design libraries, in a kind of "lift and shift" approach.

Web components typically upgrade in two steps -- starting with the light children, and then blossoming into the rich interface once the dependencies are downloaded.  With the approach mentioned above, maybe it would be possible to add a third stage?  Just an unproven thought.

Anyway, xtal-element's target audience is those who are looking for a base class that:

1.  Will benefit from the implementation of HTML Modules -- the rendering library is focused around HTMLTemplateElement-based UI definitions, rather than JSX or tagged-template literals, to define the HTML structure.
2.  Takes extensibility to a whole other level.
3.  Provides first-class support for progressive enhancement, low bandwidth.
4.  Efforts made to reap the most out of TypeScript (but use is entirely optional).   By "optional" I mean little to no extra work is required if you choose to forgo typescript. The syntax sticks exclusively to the browser's capabilities, with the exception of support for import maps, which seems to be stalled?  The base class is an abstract class.  Typescript then highlights what you need to implement in your subclass.  No need to memorize or look things up. 
5.  Some of xtal-element's base classes adopt the philosophy that it makes sense to keep the initialization process separate from the update process.  The initialization process typically involves doing one-time tasks, like cloning / importing HTML Templates, and attaching event handlers.  The update process focuses on passing in new data bindings as they change.  Keeping these two separate, and keeping the HTML Templates separate from binding mappings, may result in a bit more steps than other libraries, but hopefully the lack of magic /  increased flexibility(?) can pay off in some cases.

</details>

## What makes xtal-element different

1.  xtal-element uses the [trans-render](https://github.com/bahrus/trans-render) library for updating the UI as properties change.
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

## X -- the simplest xtal-element base class

class X, part of the xtal-element family of base web component classes, provides our first use case.  It likes things to be as simple as possible.

```JavaScript
import {X} from 'xtal-element/X.js'

const template = /* html */`
<button data-d=-1>-</button><span/><button data-d=1>+</button>
<style>
    * {
      font-size: 200%;
    }

    span {
      width: 4rem;
      display: inline-block;
      text-align: center;
    }

    button {
      width: 4rem;
      height: 4rem;
      border: none;
      border-radius: 10px;
      background-color: seagreen;
      color: white;
    }
</style>
`; // Where art thou, HTML Modules?

const [span$] = [Symbol()];
export class MyCounter extends X{

    count = 0;

    changeCount(delta){
        this.count += delta;
    }

}

X.tend({
    class: MyCounter,
    name: 'my-counter',
    attributeProps: ({count}) => ({num:[count]}),
    main: template,
    initTransform:({changeCount}) => {
        button:[,{click:[changeCount, 'dataset.d', parseInt]}], 
        span: span$,
    },
    updateTransforms: [({count}) =>({[span$]: count.toString()})]
});
```

Usage:

```html
<my-counter></my-counter>
```

Notable features of web components defined using base class X:

1.  Fairly minimal typing required.
2.  Use of "this" is quite limited -- it is only found within the small class, and doesn't seem like it would throw newcomers - as it follows
familiar patterns to Java / C# developers.
3.  Granted, there may be a bit of a learning curve, when it comes to use of "trans-rendering".  However, maybe trans-rendering is more natural to 
CSS focused developers?
4.  The class -- "MyCounter" -- is quite pristine -- in this example, it only contains the core business logic.
5.  The same class could be paired up with different HTML templates, event handlers, etc.  I.e. this is kind of the 
classic "separation of concerns" where the model is separate from the view.
6.  The class is as "library" neutral as possible.  It could be easily ported to some other library helper.
7.  First class support for Typescript is provided, as with the other base classes.  But Typescript wasn't used, in keeping with X's desire to 
promote less typing.


## More power with XtalElement

X is actually a subclass of abstract class XtalElement, with a few features removed.  

XtalElement provides additional support for progressive enhancement.

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
    //You can return true/false.  You can also indicate the name of an alternate template to clone 
    //(mainTemplate is the default property for the main template)
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

Comparisons between XtalElement and X:

1.  Less "magic", more typing.
2.  Ability to specify when the component is ready to replace the light children with something better.
3.  Ability to choose a different main template depending on dynamic scenarios (not shown above).
4.  Less separation of concerns, more use of "this."
5.  Overhead of helper library slightly smaller.

## A note on "AttributeProps"

Most web component libraries provide an "ergonomic layer" to help manage defining properties and observed attributes of the web component.

XtalElement provides two ways to do this:

### Defining properties / attributes in a non type safe way:

```JavaScript
import {XtalElement, define} from '../XtalElement.js';
class MyCustomElement extends XtalElement{
    static is = 'my-custom-element';
    static myCustomElementProps = {
        boolean: ['prop1', 'prop2'],
        numeric: ['prop3'],
        object: ['prop4']
    }
    prop1;
    prop2;
    prop3;
    prop4;
}
define(MyCustomElement);
```

### Defining properties / attributes in a type safe way using TypeScript:

```TypeScript
import {XtalElement, define} from '../XtalElement.js';
class MyCustomElement extends XtalElement{
    static is = 'my-custom-element';
    static attributeProps = ({prop1, prop2, prop3, prop4}: MyCustomElement) => (
        boolean: [prop1, prop2],
        numeric: [prop3],
        object: [prop4]
    )
    prop1;
    prop2;
    prop3;
    prop4;
}
define(MyCustomElement);
```


The function "define" does the following:

1.  Turns prop1, prop2, prop3, prop4 into public getters and setters of the class instance with the same name, without losing the value set by default. 
2.  The setter has a call to this.onPropsChange([name of prop]) baked in.
3.  Some logic to support asynchronous loading is also added to connectionCallback.
4.  Registers the custom element based on the static 'is' property.

### Defining properties / attributes with Inheritance

In order for one custom element to merge its additional properties with the properties from subclasses do the following:

```TypeScript
import {define, mergeProps} from 'xtal-element/xtal-latx.js';
import {AttributeProps, EvaluatedAttributeProps} from 'xtal-element/types.d.js';
...
export class MyBar extends MyFoo{
    ...
    static attributeProps = ({reqInit, cacheResults, reqInitRequired, debounceDuration, insertResults} : XtalFetchReq) => {
        const ap = {
            boolean: [reqInitRequired, insertResults],
            string: [cacheResults],
            number: [debounceDuration],
            object: [reqInit],
            parsedObject: [reqInit]
        }  as AttributeProps;
        return mergeProps(ap, (<any>MyFoo).props);
    };
}
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

XtalRoomWithAView extends XtalElement, but adds a pattern for retrieving a dependent View. In addition, it keeps track of the "state" the component is in -- i.e. initializing, updating, and also providing support for [aborting](https://cameronnokes.com/blog/cancelling-async-tasks-with-abortcontroller/) requests when the parameters change while in mid-flight[TODO].
 

I am hoping that the [custom state pseudo class proposal](https://www.chromestatus.com/feature/6537562418053120) will continue to gain some momentum, which empowers developers with some of the same machinery available to browser vendors when they implement internal components.  If it does, XtalRoomWithAView will certainly take advantage of that promising sounding feature. 

For now, XtalRoomWithAView also conveys state changes via data-* attributes. The attribute changes will likely be removed once (if?) the proposal above lands[TODO].

XtalRoomWithAView also supports something that may only be applicable 33.7% of the time.  Recall that XtalElement sees a strong case for separating initialization from updating, as far as rendering. Likewise, sometimes what you need to retrieve originally may differ from what needs to be retrieved subsequently.

By "update" I don't mean literally making CRUD-like updates to the system of record.  That could be handled by individual methods within the component class.  But after making such an CRUD-like update, we need to "update the view" that the user sees, to reflect the changes.  Often, that is controlled by the server, as it provides an extra sense of security that what the user sees is true to what's in the system of record.  "Refreshing" the data may be a better way of describing it.

For example, a component might want to retrieve the data required for the main view, which may be a chart or a grid.  But also, with the same data call, retrieve the data required for dropdown filters that allow for updating the main view.  Performance / maintainability considerations might make it prudent to combine the data retrieval for both the filters and the main view together in one call, especially if the filters share some of the same data as the filters. But once the original view is rendered, now as the filters change via user interaction, we only want to retrieve the data needed for the grid or chart, but not for the filters. 

Another possibility:  In a more radical departure from prevailing norms, the original asynchronous request for the "View Model" could be made for a data format easiest for the browser to digest:  HTML (and perhaps a reverse HTML 2 JS Object transform could then take place to be ready for update binding as needed).  But subsequent refreshes of the latest data may differ only slightly (think of the covid death tables, for example).  So for updates to the table, the changes may be more efficiently sent down in JSON format (a declarative subset of trans-render syntax, perhaps?).  So once again, it would probably help with the reasoning process to officially separate the initial data request from subsequent updates.   

In addition, the kind of component we are discussing generally always needs to display an initial view once enough parameters are set.

Whereas the update should only occur when a subset of the parameters in the "room" change.

It is for this reason that a separate update protocol is provided. 

The code below shows the minimal amount of code needed to define a custom element using this library.  If you are using TypeScript, it won't compile until some code is placed in many of the properties / methods below.

## Minimal XtalRoomWithAView Setup

```TypeScript
import {XtalRoomWithAView} from '../XtalRoomWithAView.js';
import {createTemplate} from 'trans-render/createTemplate.js';
import {SelectiveUpdate, TransformRules, PESettings} from '../types.d.js';

const template = createTemplate(
    /* html */`<div></div>`
);

export class MinimalView extends XtalRoomWithAView<[string, number]>{

    readyToInit = true

    initViewModel = ({}) => new Promise<[string, number]>(resolve =>{
        resolve(['Greetings, Earthling.', 0]);
    })

    readyToRender = true;

    mainTemplate = template;
    
    initTransform = {
        div: [{}, {click: this.clickHandler}] as PESettings<HTMLDivElement>,
    };

    updateTransforms = [
        ({viewModel} : MinimalView) => ({
            div: `${this.viewModel[0]}  ${this.viewModel[1]}`
        })  as TransformRules
    ]  as SelectiveUpdate[];
    
    updateTransform = () => ({
        div: `${this.viewModel[0]}  ${this.viewModel[1]}`,
    })

    clickHandler(e: Event){
        this.viewModel[1]++;
        this.viewModel[0] = "Live long and prosper.";
        this.onPropsChange('viewModel');
    }
        


}
customElements.define('mini-mal-view', MinimalView);
```


