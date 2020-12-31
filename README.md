# xtal-element

<details>
<summary>Target Audience</summary>

**NB**:  Major changes in progress.

xtal-element provides an opinionated "pattern" for creating a web component.  It does this by providing a handful of utility functions and classes, which facilitate the process.  

The great thing about web components is that they are the web equivalent of Martin Luther King's "I have a dream" speech.  Little web components built with tagged template literals can connect with little web components built with Elm, and web components will be judged by the content they provide, rather than superficial internal technical library choices. 

xtal-element adopts a number of "opinions" that may be best suited for some types of components / scenarios / developer preferences, but not necessarily everything.  

For example, an interesting duality paradox that has existed for a number of years has been between OOP vs functional programming.  Efforts to "embrace the duality paradox" like Scala and F# always appealed to me.  The "hooks" initiative adds an interesting twist to the debate, and might strike the right balance for some types of components.  Evidently, the result has been less boilerplate code, which can only be good.  Perhaps the learning curve is lower as well, and that's great.

xtal-element, though, embraces the duality paradox in a slightly different way.  It promotes sticking with classes as far as holding state (and has no issues with users of the xtal-element facilities also implementing their business logic using methods, inheritance, etc.).  But xtal-element avoids mix-ins and base classes, as they will only get in the way of the developer's ability to create their own class hierarchy, and having maximum choice in what pieces to leverage from xtal-element.  

xtal-element borrows some ideas from Rust and Python.

xtal-element's utility functions and helper classes, are all imported à la carte, meaning you can pick and choose exactly what you want to use, and not incur any costs from "bundling" unused features unnecessarily into a mixin or base class.  The cost of this freedom is a little more boilerplate, more "primitives" to contend with.  But if a class of components will all use the same features, a base class combined with common mixins can always be constructed, that hides the boilerplate from extending classes. 

Anyway, xtal-element's target audience is those who are looking for web component helpers that:

1.  Will benefit from the implementation of HTML Modules -- the rendering library is focused around HTMLTemplateElement-based UI definitions, rather than JSX or tagged-template literals, to define the HTML structure.
2.  Takes extensibility and separation of concerns to a whole other level.
3.  Provides first-class support for progressive enhancement, low bandwidth.
4.  Efforts made to reap the most out of TypeScript (but use is entirely optional), so as to avoid "magic strings" as much as possible.   By "optional" I mean little to no extra work is required if you choose to forgo typescript. The syntax sticks exclusively to the browser's capabilities, with the exception of support for import maps, which *seems* to be progressing into the standard, albeit slowly.  
5.  Some of xtal-element's utility functions adopt the philosophy that it makes sense to keep the initialization process separate from the update process.  The initialization process typically involves doing one-time tasks, like cloning / importing HTML Templates, and attaching event handlers.  The update process focuses on passing in new data bindings as they change.  Keeping these two separate, and keeping the HTML Templates separate from binding mappings, may result in a bit more steps than other libraries, but hopefully the lack of magic /  increased flexibility(?) can pay off in some cases.  This separation of concerns could, in theory, be extended to support other processes -- including build and server component processes (to be explored.)
6.  Supports micro-front-ends with versioning.

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

export class Foo extends HTMLElement{
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


## Let's start from the very beginning

The first thing you will want to do when defining a web component is to name it.  Polymer established a pattern whereby the name is provided by a static field.  xtal-element continues this tradition (as there are subtle advantages to doing so, not explained here).  

Currently, within a single document / application, that name must be unique.  This poses some contentious questions about what should happen if there's already a custom element with the same name.  xtal-element values micro-front-ends, and allows multiple versions running at the same time.  To accomplish this, do the following: 

```JavaScript
import {define} from 'xtal-element/lib/define.js';
export class DoReMi extends HTMLElement{
    static is = 'do-re-mi';
}
define(DoReMi);
```

<details>
    <summary>Lengthy explanation</summary>


As far as avoiding name conflicts, the best analogy for what xtal-element's "define" function does would be web servers that have a default port, but if that port is in use, it searches for a close by port not in use.

If another custom element is found matching the same name, the new custom element will be registered with the first non-taken number appended to the name.  Static prop 'isReally' allows consumers to know which tag name to use.  

So for the example above, regardless of whether a custom element already exists with name 'my-custom-element', you can reference the actual tag name via:

```JavaScript
import {DoReMi} from 'DoReMi/DoReMi.js';

const firstThreeNotes = document.createElement(DoReMi.isReally);
```

Most of the time, DoReMi.isReally will equal "do-re-mi" but sometimes it will be "do-re-me-1", even more rarely it could be "do-re-me-2", etc.

This solution works best for web components that either use a programmatic api as shown above, or use templates for the UI definition, as the template, or clone, can be dynamically modified to adjust the element names prior to landing inside the live DOM tree.

</details>

## Let there be props

Not so much typing, but more magic strings:

```JavaScript
import {letThereBeProps} from 'xtal-element/lib/letThereBeProps.js';

const propDefs = {
    BrownPaperPackagesTiedUpWith: {
        type: String,
    }
}
export class MyFavoriteThings extends HTMLElement{
    onPropChange(name, prop){
        console.log(prop);
    }
}
letThereBeProps(MyFavoriteThings, propDefs, 'onPropChange');
```

The third parameter, 'onPropChange' is optional.


With lots of typing, "if it compiles, then it works" attitude:

```TypeScript
import {letThereBeProps} from 'xtal-element/lib/letThereBeProps.js';
import {getSlicedPropDefs} from 'xtal-element/lib/getSlicedPropDefs.js';
import {destructPropInfo, PropDef} from '../types.d.js';

const propDefGetter : destructPropInfo[] = [
    ({BrownPaperPackagesTiedUpWith}: MyFavoriteThings) => ({
        type: String,
    })
];
const slicedPropDefs = getSlicedPropDefs(propDefGetter);

export class MyFavoriteThings extends HTMLElement{
    BrownPaperPackagesTiedUpWith: String;
    onPropChange(name: string, prop: PropDef){
        console.log(prop);
    }
}
letThereBeProps(MyFavoriteThings, slicedPropDefs.propDefs, 'onPropChange');
```

## Support for asynchronous loading

If prop values might be passed to an element before the element becomes registered (always best to be prepared for this to happen), then you can do this by utilizing the "propUp" function:

```JavaScript
import {propUp} from 'xtal-element/lib/propUp.js';
export class SixteenGoingOnSeventeen extends HTMLElement{
    foodAndWine: Offerings;
    connectedCallback(){
        propUp(this, ['foodAndWine'], {
            foodAndWine: 'appleStrudel'
        });
    }
}
```

The third, optional parameter is where you can specify the default values, if nothing was passed in yet.

## Reactive Prop Actions

```TypeScript
import {Reactor} from 'xtal-element/lib/Reactor.js';
import {ReactiveSurface} from 'xtal-element/lib/types.d.js';
export class ClimbEveryMountain extends HTMLElement implements ReactiveSurface{
    ClimbedEveryMountain: boolean;
    SearchedHighAndLow: boolean;
    FollowedEveryHighway: boolean;
    FoundMyDream: boolean;


    //ReactiveSurface implementation
    propActions = [({ClimbedEveryMountain, SearchedHighAndLow, FollowedEveryHighway}: ClimbEveryMountain) => {
        this.FoundMyDream = ClimbedEveryMountain && SearchedHighAndLow && FollowedEveryHighway;
    }] as PropAction[]
    reactor = new Reactor(this);

    onPropChange(name: string, prop: PropDef){
        console.log("Been there, done that.");
        this.reactor.addToQueue(prop);
    }

}
```

<details>
    <summary>Detailed Explanation</summary>

## Setter logic

Defining a new property is, by design, meant to be as easy as possible:

```Typescript
export class MyCustomElement extends HTMLElement{
    myProp:string;
}
```

The problem arises when something special needs to happen when myProp's value is set.  

If all you want to do is fire off an event when a property is set, xtal-element supports defining "notifying" properties which will do that for you.  Likewise, if the only impact of the changed property is in what is displayed, that is supported by xtal-element's init and update transforms, discussed farther down..

But the need to do different types of things when properties change isn't limited to these two common requirements.  So typically, you then have to add logic like this:

```js
export class MyCustomElement extends HTMLElement{
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
export class MyCustomElement extends HTMLElement{
    
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

To make the code above easier to manage, you can stick with simple fields for all the properties, and implement the property "propActions":

```JavaScript
export class MyCustomElement extends HTMLElement{

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

XtalElement will invoke this action anytime prop1, prop2 and/or prop3 change.

Here, "self" is another name for "this" -- inspired by Python / Rust's trait implementations.  

But because it doesn't use the keyword "this," we can place the "trait implementation" in a separate constant, which is a little better, performance wise:

```js

const linkProp4: ({prop1, prop2, prop3, self}) => ({
    self.prop4 = prop1 + prop2 + prop3;
});

export class MyCustomElement extends HTMLElement{
    ...
    prop1 = 'myValue1';
    prop2 = 'myValue2';
    prop3 = 'myValue3';
    prop4;

    propActions = [linkProp4];

}
```


<details>
    <summary>PropAction pontifications</summary>

### Unit Testing benefits?

For those scenarios where pure JS, browser-less unit testing is important, it seems to me that unit testing linkProp4 would be quite straightforward, more straightforward than testing a method within a custom element class.  Because testing a method in a custom element class requires either a browser emulator like JSDOM or puppeteer, or a mock HTMLElement class.   Plus running the constructor code, etc.  No such requirement is need for linkProp4 above.  Furthermore, the signature of methods typically doesn't indicate what specific parameters the method depends on.  On the other hand, by design, the developer will want to spell out the dependencies explicitly with these propActions, in order to guarantee that it is always evaluated as needed.  

Another theoretical benefit -- by separating the actions from the actual class, (some of) the actions could be dynamically loaded, and only activated after the  download is complete (if these property actions are only applicable after the initial render).  In the meantime, an initial view can be presented.  The savings could be significant when working with a JS-heavy web component.  This is a TODO item to explore.

### Limitations 

propActions (and updateTransforms, discussed below) rely heavily on destructuring the class as the argument of an arrow function.  JavaScript doesn't appear to support destructuring objects with ES6 symbols as keys.

Separating "propAction" arrow functions out of the class as an (imported) constant imposes an additional limitation -- a limitation that isn't applicable when the actions are defined inside the class -- these external constants don't support responding to, or modifying, private members (something in the very early stages of browser adoption).  I thought using "bind" might give access to private fields, but no such luck.  The propActions public field, of course, allows a mixture of inline, instance-based propActions, empowered with access to private members, combined with the more limited (but portable, individually testable) external lambda expressions. So when private member access is needed, those actions could remain inside the class.

Also, in general, propActions (local in the class or external) is not an elegant place to add event handlers onto internal components.  The best place to add event handlers is in the initTransform.  (Note:  Even the initTransform can be defined via a destructured arrow function, and moved outside of the class.)

### Priors

The resemblance of these "propActions" to Rust trait implementations, a connection made above, is a bit superficial.  They're closer in spirit to computed values / properties with one significant difference -- they aggressively *push / notify* new values of properties, which can trigger targeted updates to the UI, rather than passively calculating them when requested (like during a repeated global render process).  And since we can partition rendering based on similar property groupings, we can create pipeline view updates with quite a bit of pinpoint accuracy.  

It's possible that libraries that don't support this kind of property change "diffraction", but rely on "template-optimized re-rendering" of the entire UI with every property change, end up also avoiding unnecessary updates, based on their clever diff-engine algorithms.  I can say as a user of a limited number of such libraries, that what is actually getting updated, when and why, has always a bit of a mystery for me, so that I end up "winging it" more often than I'd like.  This library puts the onus (and power) in the developer's hands to devise (and fully understand) their own strategy, not sparing the developer the details of the trade offs. 

I hasten to add that [watching a group of properties doesn't](https://medium.com/@jbmilgrom/watch-watchgroup-watchcollection-and-deep-watching-in-angularjs-6390f23508fe) appear to be a [wholly new concept, perhaps](https://guides.emberjs.com/v1.10.0/object-model/observers/#toc_observers-and-asynchrony).


Another benefit of "bunching together" property change actions: XtalElement optionally supports responding to property changes asynchronously.  As a result, rather than evaluating this action 3 times, it will only be evaluated once, with the same result.  Note that this async feature is opt in (by putting the desired properties in the "async" category).

After experimenting with different naming patterns, personally I think if you choose to separate out these prop actions into separate constants, names like "linkProp4" is (close to?) the best naming convention, at least for one common scenario.  Often, but not always, these property group change observers / actions will result in modifying a single different property, so that computed property becomes actively "linked" to the other properties its value depends on. So the name of the "property group watcher" could be named link[calculatedPropName] in this scenario.  Not all propActions will result in preemptively calculating a single "outside" property whose value depends on other property values, hence we stick with calling this orchestrating sequence "propActions" rather than "propLinks" in order to accommodate more scenarios. 

It's been my (biased) experience that putting as much "workflow" logic as possible into these propActions makes managing changing properties easier -- especially if the propActions are arranged in a logical order based on the flow of data, similar in concept perhaps to RxJs, where property groupings become the observables, and "subscriptions" based on resulting property changes come below the observable actions.  

### Debugging Disadvantage

One disadvantage of using propActions, as opposed to setter methods / class methods, is with the latter approach, one can step through the code throughout the process.  Doing so with propActions isn't so easy, so one is left wondering where the code will go next after the action is completed.

To address this concern, you can override the method:  

```JavaScript
propActionsHub(propAction){
    console.log(propAction); //or whatever helps with debugging
}
```

</details>

</details>

**NB:** Discussion below will change radically.



## Development Section

The next few sections are going to prove to be a bit dry reading.  Think of it as the [boring](https://youtu.be/okWr-tzwOEg?t=78) [development](<https://en.wikipedia.org/wiki/Violin_Sonata_No._9_(Beethoven)>) [section](https://en.wikipedia.org/wiki/Musical_development) of a sonata.

Previously, the way xtal-element handled visual updates was in a way that closely resembled the "reactor" functionality, but there was no unifying force, and also picking and choosing which libraries to use was overly complicated, resulting in larger than needed base footprint..

What we will be discussing for a while will finally lead up to our rendering approach, but first we must go through some [exercises](https://youtu.be/TPtDbHXkDp4?t=187) to get there.

### Nested reactions [TODO]

Reactions can be nested:

```TypeScript
    propActions = [linkFindingMyDream, [linkFindYourPlace]]
```

### Post-Reaction [TODO]

In the example above, the function:

```JavaScript
[({ClimbedEveryMountain, SearchedHighAndLow, FollowedEveryHighway}: ClimbEveryMountain) => {
        this.FoundMyDream = ClimbedEveryMountain && SearchedHighAndLow && FollowedEveryHighway;
}]
```

didn't actually *return* anything.  What should the reactor do with anything returned?

We can specify that using a return mapping:

```TypeScript
import {myStringProcessor, myArrayProcessor}
reactor = new Reactor(this, [
    {
        type: String,
        do: myStringProcessor
    },
    {
        type: Array,
        do: myArrayProcessor
    }
]);
```

So if the right-hand-side of the action returns a string, pass the context to function myStringProcessor.  If it returns an array, use myArrayProcessor.

Out actions don't have to have a function body.  If a post-reaction function of the reactor library can render a view for example, and it just needs some configuration passed in, you can specify it with an expression:

```JavaScript
({prop1}) => ({
    section:{
        h1: prop1
    }
})
```

This also allows us to use reactions as opportunities to pass declarative JSON-ish syntax to template transformers (for example), which we will see below.

### Ready-made reactor libraries

## Rendering Views