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
2.  Takes extensibility and separation of concerns to a whole other level.
3.  Provides first-class support for progressive enhancement, low bandwidth.
4.  Efforts made to reap the most out of TypeScript (but use is entirely optional).   By "optional" I mean little to no extra work is required if you choose to forgo typescript. The syntax sticks exclusively to the browser's capabilities, with the exception of support for import maps, which seems to be stalled?  The base class is an abstract class.  Typescript then highlights what you need to implement in your subclass.  No need to memorize or look things up.  (Unfortunately, Typescript doesn't support [abstract static properties / methods.](https://github.com/microsoft/TypeScript/issues/34516)).
5.  Some of xtal-element's base classes adopt the philosophy that it makes sense to keep the initialization process separate from the update process.  The initialization process typically involves doing one-time tasks, like cloning / importing HTML Templates, and attaching event handlers.  The update process focuses on passing in new data bindings as they change.  Keeping these two separate, and keeping the HTML Templates separate from binding mappings, may result in a bit more steps than other libraries, but hopefully the lack of magic /  increased flexibility(?) can pay off in some cases.
6.  Supports micro-frontends with versioning.

</details>

## What makes xtal-element different

1.  xtal-element uses the [trans-render](https://github.com/bahrus/trans-render) library for updating the UI as properties change.
2.  The separation of concerns that trans-render provides makes it possible to separate out the initial render from update renders.
3.  Even the update renders can be easily partitioned based on which properties change.   Consider the following example:

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
    ...
    updateTransforms = [
        ({prop1}) => ({
            section:{
                h1: prop1
            }
        }),
        ({prop1, prop2}) => ({
            section:{
                h2: prop1 + prop2
            }
        }),
        ({prop1, prop3}) => ({
            footer: {
                h3: prop1 + prop3
            }
        }),
        ({prop1, prop2, prop3}) => ({
            footer:{
                h4: prop1 + prop2 + prop3
            }
        })
    }]

}
```

4.  A similar pattern is used for easily testable "propActions" - where property changes can be grouped/partitioned and turned into a logical workflow.
5.  Many of these transforms and actions can be separated from the custom element class, leaving behind a pristine, mostly library-neutral class.

## X -- the simplest xtal-element base class

class X, part of the xtal-element family of base web component classes, provides our first use case.  It likes things to be as simple and clean as possible.

```JavaScript
import {X} from 'xtal-element/X.js'

const template = /* html */`
<button data-d=-1>-</button><span></span><button data-d=1>+</button>
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
    initTransform:({changeCount}) => ({
        button:[,{click:[changeCount, 'dataset.d', parseInt]}], 
        span: span$,
    }),
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
3.  Granted, there may be a bit of a learning curve when it comes to use of "trans-rendering".  However, maybe trans-rendering is more natural to 
CSS focused developers?
4.  The class -- "MyCounter" -- is quite pristine -- in this example, it only contains the core business logic.
5.  The same class could be paired up with different HTML templates, event handlers, etc.  I.e. this is kind of the 
classic "separation of concerns" where the model is separate from the view.
6.  The class is as "library" neutral as possible.  It could be easily ported to some other library helper.
7.  First class support for Typescript is provided, as with the other base classes.  But Typescript wasn't used, in keeping with X's desire to 
promote less typing.

<details>
    <summary>NBs</summary>

On point 6 above, the fact that class MyCounter extends class X does weaken the argument that the class is truly library neutral. The point I'm trying to make is it would not be very awkward to migrate to some other library, because as you can see, none of the logic is directly accessing any methods or properties of the base class.

To achieve point 6 more thoroughly, you could write the counter logic as a [mixin](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes#Mix-ins), which is a little more challenging and more of a brain twister.

Speaking of which:

</details>

## Even more purity with X

X supports another function, "cessorize" which allows the developer to use truly library neutral mixins to define easily testable business logic:

The example demonstrates use of X with TypeScript:

```Typescript
import {X, TransformGetter, TransformRules} from '../X.js';
import {PESettings} from 'trans-render/types.d.js';
import { SelectiveUpdate } from '../types.js';

const template = /* html */`
<button data-d=-1>-</button><span></span><button data-d=1>+</button>
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
`;




interface ICounterMixin{
    count: number;
    changeCount(delta: number): void;
}

type CounterExtension = X & ICounterMixin;

export const CounterXMixin = (Base: any) => class extends Base{
    count = 0;

    changeCount(delta: number){
        this.count += delta;
    }
}

const [span$] = [Symbol('span')];
X.cessorize<CounterExtension>({
    name: 'counter-xs',
    mixins: [CounterXMixin],
    main: template,
    attributeProps: ({count}: ICounterMixin) => ({num:[count]}),
    initTransform: ({changeCount} : ICounterMixin) => ({
        button:[,{click:[changeCount, 'dataset.d', parseInt]}] as any as PESettings<CounterExtension>, 
        span: span$,
    }) as TransformRules,
    updateTransforms:[ ({count}: ICounterMixin) => ({[span$]: count.toString()})]
})
```

## More power with XtalElement

X is actually a subclass of abstract class XtalElement, with a few features removed.  

XtalElement provides additional support for progressive enhancement.

Here is a minimal example of a web component that extends XtalElement:


```TypeScript
import {createTemplate} from 'trans-render/createTemplate.js';
import {XtalElement, define} from '../XtalElement.js';
import {AttributeProps} from '../types.js';
import {PESettings} from 'trans-render/types.d.js';

const mainTemplate = createTemplate(/* html */`
<button data-d=-1>-</button><span></span><button data-d=1>+</button>
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
`);
const span$ = Symbol('spanSym');

/**
 * @element counter-xtal-element
 */
export class CounterXtalElement extends XtalElement{
    //Name of custom element
    static is = 'counter-xtal-element';

    //Properties / attributes spelled out so reflection can auto generate
    //needed code
    static attributeProps = ({count} : CounterXtalElement) => ({
        num: [count]
    }  as AttributeProps);

    //This property / field allows the developer to wait for some required 
    //properties to be set before doing anything.
    // To make this depend on the context, switch from a class field to a getter.
    readyToInit = true;

    //Until readyToRender is set to true, the user will see the light children (if using Shadow DOM).
    //You can return true/false.  You can also indicate the name of an alternate template to clone (mainTemplate is the default property for the main template), by setting the 
    //value to the (string) name of an alternative property to "mainTemplate"
    readyToRender = true;

    //XtalElement is intended for visual elements only.
    //Templates need to be stored outside instances of web components for 
    //optimal performance
    mainTemplate = mainTemplate;

    
    [span$]: HTMLSpanElement;
    //uses trans-render syntax: https://github.com/bahrus/trans-render
    //initTransform is only done once.
    initTransform = {
        button:[,{click:[this.changeCount, 'dataset.d', parseInt]}] as PESettings<CounterXtalElement>,
        span: span$,
    };

    // updateTransforms is called anytime property "name" changes (in this example).
    // Any other property changes won't trigger an update, as there is no
    // arrow function in array with any other property name.
    // Save a little bit of class instantiation time by referencing a static updateTransforms array.
    updateTransforms =  [ 
        ({count}: CounterXtalElement) => ({[span$]: count.toString()})
    ];

    count = 0;

    changeCount(delta: number){
        this.count += delta;
    }
    
}
define(CounterXtalElement);

```

Comparisons between XtalElement and X.  Unlike X, XtalElement has:

1.  Less "magic", more typing.
2.  Ability to specify when the component is ready to replace the light children with something better.
3.  Ability to choose a different main template depending on dynamic scenarios (not shown above).
4.  Ability to opt out of Shadow DOM (not shown above).
5.  Less separation of concerns, more use of "this."
6.  Overhead of helper library slightly smaller.
7.  Full power of inheritance allows for extending the class, and overriding templates, transforms, etc.

## A note on "AttributeProps"

Most web component libraries provide an "ergonomic layer" to help manage defining properties and observed attributes of the web component.

XtalElement does as well, but slices the categorization slightly differently from other web component libraries:

### Defining properties / attributes

```TypeScript
import {XtalElement, define, AttributeProps} from '../XtalElement.js';
class MyCustomElement extends XtalElement{
    static is = 'my-custom-element';

    static attributeProps = ({prop1, prop2, prop3, prop4}: MyCustomElement) => ({
        bool: [prop1, prop2],
        num: [prop3],
        obj: [prop4]
    } as AttributeProps);

    prop1;
    prop2;
    prop3;
    prop4;
}
define(MyCustomElement);
```

The function "define" does the following:

1.  Turns prop1, prop2, prop3, prop4 into public getters and setters of the class instance with the same name, without losing the value set by default (see note below). 
2.  The setter has a call to this.onPropsChange([name of prop]) baked in.
3.  Some logic to support asynchronous loading is also added to connectionCallback.
4.  Registers the custom element based on the static 'is' property.

### Defining properties / attributes with inheritance

In order for one custom element to merge its additional properties with the properties from subclasses do the following:

```TypeScript
import {define, mergeProps} from 'xtal-element/xtal-latx.js';
import {AttributeProps, EvaluatedAttributeProps} from 'xtal-element/types.d.js';
...
export class MyBar extends MyFoo{
    ...
    static attributeProps: any = ({reqInit, cacheResults, reqInitRequired, debounceDuration, insertResults} : MyBar) => {
        const ap = {
            bool: [reqInitRequired, insertResults],
            str: [cacheResults],
            num: [debounceDuration],
            obj: [reqInit],
            jsonProp: [reqInit]
        }  as AttributeProps;
        return mergeProps(ap, (<any>MyFoo).props);
    };
}
```


The categories properties can be put into are:

```JavaScript
['bool', 'str', 'num', 'reflect', 'notify', 'obj', 'jsonProp', 'dry', 'log', 'debug', 'async']
```


## Setter logic

Defining a new property is, by design, meant to be as easy as possible (but see [cautionary](#default-values-of-properties-in-depth) note below):

```js
export class MyCustomElement extends XtalElement{
    myProp = 'myValue';
}
```

The problem arises when something special needs to happen when myProp's value is set.  

If all you want to do is fire off an event when a property is set, XtalElement supports defining "notify" properties which will do that for you.  Likewise, if the only impact of the changed property is in what is displayed, that is supported by XtalElement's init and update transforms.

But the need to do different types of things when properties change isn't limited to these two common requirements.  So typically, you then have to add logic like this:

```js
export class MyCustomElement extends XtalElement{
    _myProp = 'myValue';
    get myProp(){
        return this._myProp;
    }
    set myProp(nv){
        this._myProp;
        //do my special logic

        //Don't forget to make the call below, so everything is in sync:
        this.onPropsChange('myProp');
    }
}
```

which is kind of a pain.  Furthermore sometimes you need to add logic that is tied to more than one property changing, so now you need to add a call to a common method, and there's no debouncing support out of the box etc.:

```js
export class MyCustomElement extends XtalElement{
    
    ...
    _prop1 = 'myValue1';
    get prop1(){
        return this._myProp;
    }
    set prop1(nv){
        this._prop1 = nv;
        this.doSomeCommonLogic();
        this.onPropsChange('prop1');
    }

    _prop2 = 'myValue2';
    get prop2(){
        return this._prop2;
    }
    set prop2(nv){
        this.prop2 = nv;
        this.doSomeCommonLogic();
        this.onPropsChange('prop2');
    }

    _prop3 = 'myValue3';
    get prop3(){
        return this._prop3;
    }
    set prop3(nv){
        this._prop3 = nv;
        this.doSomeCommonLogic();
        this.onPropsChange('prop3');
    }

    prop4;

    doSomeCommonLogic(){
        //TODO:  debouncing
        this.prop4 = this.prop1 + this.prop2 + this.prop3;
    }
}
```

### Observable Property Groups

To make the code above easier to manage, you can stick with simple fields for all the properties (see [cautionary note](#default-values-of-properties-in-depth) below), and implement the property "propActions":

```JavaScript
export class MyCustomElement extends XtalElement{
    static attributeProps ({prop1, prop2, prop3} : MyCustomElement) => ({
        str: [prop1, prop2, prop3]
    });
    ...
    prop1 = 'myValue1';
    prop2 = 'myValue2';
    prop3 = 'myValue3';
    prop4;
    propActions = [
        ({prop1, prop2, prop3, self}) => {
            self.prop4 = prop1 + prop2 + prop3;
        }
    ]
    ...
}
```

Here, "self" is another name for "this" -- inspired by Python / Rust's trait implementations.  

But because it doesn't use the keyword "this," we can place the "trait implementation" in a separate constant, which is a little better, performance wise:

```js

const linkProp4: ({prop1, prop2, prop3, self}) => ({
    self.prop4 = prop1 + prop2 + prop3;
});

export class MyCustomElement extends XtalElement{
    ...
    prop1 = 'myValue1';
    prop2 = 'myValue2';
    prop3 = 'myValue3';
    prop4;

    propActions = [linkProp4];

}
```

Another theoretical benefit -- by separating the actions from the actual class, the actions could be dynamically loaded, and only activated after the download is complete (if these property actions are only applicable after the initial render).  In the meantime, an initial view can be presented.  The savings could be significant when working with a JS-heavy web component.  This is a TODO item to explore.

**Limitations**:  

Separating "propAction" lambda expressions out of the class as an (imported) constant imposes one known limitation -- a limitation that isn't applicable when the actions are defined inside the class -- these external constants don't support responding to, or modifying, private members (something in the very early stages of browser adoption).  The propActions public field, of course, allows a mixture of inline, instance-based propActions, empowered to access to private members, combined with the more limited (but portable, individually testable) external lambda expressions. So when private member access is needed, it could remain inside the class.

Also, in general, these propActions (local in the class or external) is not an elegant place to add event handlers onto internal components.  The best place to add event handlers is in the initTranform.  (Note:  Even the initTransform can be defined via a destructured arrow function, and moved outside of the class.)

<details>
    <summary>PropAction pontifications</summary>

The resemblance of these "propActions" to Rust trait implementations, a connection made above, is a bit superficial.  They're closer in spirit to computed values / properties with one significant difference -- they aggressively *push / notify* new values of properties, which can trigger targeted updates to the UI, rather than passively calculating them when requested (like during a repeated global render process).  And since we can partition rendering based on similar property groupings, we can create pipeline view updates with quite a bit of pinpoint accuracy.  

It's possible that libraries that don't support this kind of property change "diffraction", but rely on "template-optimized re-rendering" of the entire UI with every property change, end up also avoiding unnecessary updates, based on their clever diff-engine algorithms.  I can say as a user of a limited number of such libraries, that what is actually getting updated, when and why, has always a bit of a mystery for me, so that I end up "winging it" more often than I'd like.  This library puts the onus (and power) in the developer's hands to devise (and fully understand) their own strategy, not sparing the developer the details of the trade off. 

I hasten to add that [watching a group of properties doesn't](https://medium.com/@jbmilgrom/watch-watchgroup-watchcollection-and-deep-watching-in-angularjs-6390f23508fe) appear to be a [wholly new concept, perhaps](https://guides.emberjs.com/v1.10.0/object-model/observers/#toc_observers-and-asynchrony).


Another benefit of "bunching together" property change actions: XtalElement optionally supports responding to property changes asynchronously.  As a result, rather than evaluating this action 3 times, it will only be evaluated once, with the same result.  Note that this async feature is opt in (by putting the desired properties in the "async" category).

After experimenting with different naming patterns, personally I think if you chose to separate out these prop actions into separate constants, names like "linkProp4" is (close to?) the best naming convention, at least for one common scenario.  Often, but not always, these property group change observers / actions will result in modifying a single different property, so that computed property becomes actively "linked" to the other properties its value depends on. So the name of the "property group watcher" could be named link[calculatedPropName] in this scenario.  Not all propertyActions will result in preemptively calculating a single "outside" property whose value depends on other property values, hence we stick with calling this orchestrating sequence "propActions" rather than "propLinks" in order to accommodate more such scenarios. 

It's been my (biased) experience that putting as much "workflow" logic as possible into these propActions makes managing changing properties easier -- especially if the propActions are arranged in a logical order based on the flow of data, similar in concept perhaps to RxJs, where property groupings become the observables, and "subscriptions" based on resulting property changes come below the observable actions.   

</details>

### Default values of properties, in depth

This library follows the [best practices](https://developers.google.com/web/fundamentals/web-components/best-practices#lazy-properties) approach to allow lazy loading of properties.  Meaning it should be fine to set the properties of a custom element tag, even when that tag has not yet been elevated from an unknown element into a custom element.

xtal-element also has a strong desire to keep things as simple as possible.  In particular, as was mentioned earlier, this syntax is considered ideal:

```JavaScript
export class MyCustomElement extends XtalElement{
    static is = 'my-custom-element';
    myProp = 'myDefaultValue';
}
```

Unfortunately, these two goals appear to be at odds -- the default value myProp = 'myDefaultValue' *could* be executed *after* the value of myProp was already passed to the my-custom-element tag, especially the first time.

The only way I see how this could be safely avoided, sticking to standard class mechanisms, would be to have logic in the constructor such as:

```JavaScript
export class MyCustomElement extends XtalElement{
    static is = 'my-custom-element';
    constructor(){
        if(this.myProp === undefined) this.myProp = 'myDefaultValue';
    }
}
```

If you must do this for a significant number of properties, XtalElement provides support for an alternative, more declarative  way of initializing values that may pay off.  Typescript is added to illustrate the extra steps needed to provide some type safety:

```Typescript

export interface MyCustomElementProps {
    myProp1: string;
    myProp2: number;
    myProp3: boolean;
}

export class MyCustomElement extends XtalElement{
    static is = 'my-custom-element';
    static defaultValues  = {
        myProp1: 'myValue',
        myProp2: 42,
        myProp3: true
    } as MyCustomElementProps;

}
```


## Notification / Events

Properties that are categorized as "notify" properties in AttribteProps emit events when they change value.

For example:

```JavaScript
export class MyCustomElement extends XtalElement{
    static attributeProps ({prop1, prop2, prop3} : XtalFetchReq) => ({
        str: [prop1, prop2, prop3],
        notify:[prop1]
    });
    ...
}
```

Then whenever the value of prop1 changes on a web component instance, the instance emits a custom event:

```JavaScript
new CustomEvent('prop1-changed', {
    details{
        value: /*new value of prop1*/
    },
    bubbles: false,
    cancelable: false,
    composed: false
})
```

The name of the event is the lisp-cased name of the property followed by -changed.

The default propagation values for bubbles, cancelable, composed, is a point of some contention, at least in my mind.  Polymer defaults bubbles to true.  This is quite convenient, especially when handling a large group of child elements of the same type.  Only one event handler needs to be attached to some parent or ancestor in this case.  Attaching individual event handlers on this (dynamic) list of elements is quite a nuisance.  

However, recent recommendations seem to [discourage making events bubble](https://developer.salesforce.com/docs/component-library/documentation/en/48.0/lwc/lwc.events_best_practices), as that would be "the least disruptive."

Trying to predict ahead of time which events would be most used for a group of component, where not bubbling is a nuisance, vs. not, where event bubbling could be disruptive, seems near impossible.

So XtalElement allows users to individual instances to override how the events should propagate.  E.g.

```html
<xtal-link-preview event-scopes='[["view-model-changed","bubbles"]]'  base-link-id=corsAnywhere href="https://ionicframework.com/docs/components/"></xtal-link-preview>
```

The event mapping uses "starts with", so that you could also do:

```html
<xtal-link-preview event-scopes='[["view-","bubbles"]]'  base-link-id=corsAnywhere href="https://ionicframework.com/docs/components/"></xtal-link-preview>
```

which makes any custom events starting with "view-" to bubble (at least those custom events caused by XtalElement's notification support).

If you want to make all XtalElement generated events bubble, do something like this:

```html
<xtal-link-preview event-scopes='[[,"bubbles"]]'  base-link-id=corsAnywhere href="https://ionicframework.com/docs/components/"></xtal-link-preview>
```

## Inheritance overindulgence?

By leveraging css-based transformations, subclasses which override the transformations have fairly free reign.  But probably no more so than more traditional class-based components (which can override render and do whatever it pleases).  This is largely a symptom of lack of a "final" keyword for properties and methods, even within TypeScript.

But what XtalElement is guilty of, perhaps, is making it more tempting to take great liberties with the original UI.  XtalElement, by design, tries to make it easy for inheriting subclasses to tweak the rendered output, compared with more traditional rendering methods.  

XtalElement's template processing can still benefit from standard inheritance, in the sense that transformation branches can be defined within a method, and that method can be overridden, which is all fine and good.  But XtalElement allows an easy way to amend *any* part of the document easily, not just specially marked sections from the base class.

XtalElement's initTransform, with it's JSON like object literal transform, can fairly easily be (deep) merged with additional / alternative transform rules.  The updateTransforms array could likewise be tweaked, though with a bit more difficulty.

As a final stop gap, XtalElement allows a chain to be set up during initialization (and updates) of the component.  The benefits of this are much stronger with initialization and the first update, because during that time, nothing has been added to the DOM tree, hence alterations are fairly low cost and best done ahead of time.

In particular, a subclass can add the following methods:

```TypeScript
initRenderCallback(ctx: RenderContext, target: HTMLElement | DocumentFragment){}
afterUpdateRenderCallback(ctx: RenderContext, target: HTMLElement | DocumentFragment, renderOptions: RenderOptions | undefined){}
```

**NB**  This kind of css-based inheritance chain that XtalElement provides probably shouldn't go too many levels deep.  I.e. a vendor provides a default UI, which a consumer can tweak, essentially.  But having a chain of independent, loosely coupled third party developers inheriting in this manner seems like it could lend itself to some significant fragility.

## Versioning [TODO, will it work?]

HTML Modules and scoped custom element registries are easily the two proposals I most eagerly await.

A number of intriguing interim proposals are being adopted in the absence of scoped custom element registries.  Because trans-render provides a number of facilities for substituting one tag name for another, here's the approach xtal-element adopts:

The best analogy would be web servers that have a default port, but if that port is in use, it searches for a close by port not in use.

If another custom element is found matching the same name, the new custom element will be registered with the first non-taken number appended to the name.  Static prop 'isReally' allows consumers to know which tag name to use.  Using this feature is not easy if using dynamic import (I think). 

So for XtalElement, use the "is" static prop to define the default custom element name, as before (modeled after Polymer):

```JavaScript
import {define} from 'xtal-element/XtalElement.js';

export class MyElement extends XtalElement{
    static is = 'my-element';
}
define(MyElement)
```

Regardless of whether a custom element already exists with name 'my-element', you can reference the actual tag name via:

```JavaScript
import {MyElement} from 'MyElement/MyElement.js';

const myElement = document.createElement(MyElement.isReally);
```

Most of the time, MyElement.isReally will equal "my-element" but sometimes it will be "my-element-1", even more rarely it could be "my-element-2", etc.

The names will surely conform to a [geometric distribution](https://en.wikipedia.org/wiki/Geometric_distribution) where

> p = number of versions in circulation via npm / number of commits in git.

The main template could then have some indicator like:

```html
<template>
    <div>
        <my-element- my-attribute="myValue"></my-element->
    </div>
</template>
```

And if that's coupled with a substitution transform rule:

```JavaScript

import {MyElement} from 'MyElement/MyElement.js';

const initTransform = {
    ...
    'my-element-': [MyElement.isReally, 'replace'],
    ...
}

```


## A room with a view 

I suspect that many (most?) components today tend to have a one-to-one mapping between a component and a business domain object fetched via some promise-based Rest / GraphQL / (SOAP?) api.  XtalRoomWithAView provides help to provide a pattern for doing this, in such a way that the light children will continue to display until such a time as there's something better to see than the light children.  

XtalRoomWithAView extends XtalElement, but adds a pattern for retrieving a dependent view. In addition, it keeps track of the "state" the component is in -- i.e. initializing, updating, and also providing support for [aborting](https://cameronnokes.com/blog/cancelling-async-tasks-with-abortcontroller/) requests when the parameters change while in mid-flight[TODO].
 

I am hoping that the [custom state pseudo class proposal](https://www.chromestatus.com/feature/6537562418053120) will continue to gain some momentum, which empowers developers with some of the same machinery available to browser vendors when they implement internal components.  If it does, XtalRoomWithAView will certainly take advantage of that promising sounding feature. 

For now, XtalRoomWithAView also conveys state changes via data-* attributes, so that styling effects can be put into place. The attribute changes will likely be removed once (if?) the proposal above lands[TODO].

XtalRoomWithAView also supports something that may only be applicable 33.7% of the time.  Recall that XtalElement sees a strong case for separating initialization from updating, as far as rendering. Likewise, sometimes what you need to retrieve originally may differ from what needs to be retrieved subsequently.

<details>
<summary>Terminology</summary>
The word "update" in this context seems too easily confused with making CRUD-like updates to the system of record.  That could be handled by individual methods within the component class.  But after making such an CRUD-like update, we need to "refresh the view" that the user sees, to reflect the changes.  Often, that refresh of data is generated by the server, as it provides an extra sense of security that what the user sees is true to what's in the system of record.  So whereas client-side rendering is roughly divided into "init" vs "update" transforms, server-side fetching is described with the verbs init and refresh.
</summary>
</details>

For example, a component might want to retrieve the data required for the main view, which may be a chart or a grid.  But also, with the same data call, retrieve the data required for dropdown filters that allow for refreshing the main view.  Performance / maintainability considerations might make it prudent to combine the data retrieval for both the filters and the main view together in one call, especially if the filters share some of the same data as the filters. But once the original view is rendered, now as the filters change via user interaction, we only want to retrieve the data needed for the grid or chart, but not for the filters. 

Another possibility:  In a more radical departure from prevailing norms, the original asynchronous request for the "View Model" could be made for a data format easiest for the browser to digest:  HTML (and perhaps a reverse HTML 2 JS Object transform could then take place to be ready for update binding as needed).  But subsequent refreshes of the latest data may differ only slightly (think of the covid death tables, for example).  So for updates to the table, the changes may be more efficiently sent down in JSON format (a declarative subset of trans-render syntax, perhaps?).  So once again, it would probably help with the reasoning process to officially separate the initial data request from subsequent refreshes.   

In addition, the kind of component we are discussing generally always needs to display an initial view once enough parameters are set.

Whereas the refresh should only occur when a subset of the parameters in the "room" change.

It is for this reason that a separate refresh method is prescribed. 

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


