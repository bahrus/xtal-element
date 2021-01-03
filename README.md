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

xtal-element's utility functions and helper classes, are all imported à la carte, meaning you can pick and choose exactly what you want to use, and not incur any costs from "bundling" unused features unnecessarily into a mixin or base class.  The cost of this freedom is a little more boilerplate, more "primitives" to contend with.  But if a class of components will all use the same features, a base class combined with common mix-ins can always be constructed, that hides the boilerplate from extending classes. 

[Catalyst](https://github.github.io/catalyst/) takes the same approach.

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

So for the example above, regardless of whether a custom element already exists with name 'do-re-mi', you can reference the actual tag name via:

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
const propDefs = getPropDefs(propDefGetter);
const slicedPropDefs = getSlicedPropDefs(propDefs);

export class MyFavoriteThings extends HTMLElement{
    BrownPaperPackagesTiedUpWith: String;
    onPropChange(name: string, prop: PropDef){
        console.log(prop);
    }
}
letThereBeProps(MyFavoriteThings, slicedPropDefs.propDefs, 'onPropChange');
```

## Support for asynchronous loading

If prop values might be passed to an element before the [element becomes registered](https://developers.google.com/web/fundamentals/web-components/best-practices#lazy-properties) (always best to be prepared for this to happen), then you can do this by utilizing the "propUp" function:

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
    FoundYourDream: boolean;


    //ReactiveSurface implementation
    propActions = [({ClimbedEveryMountain, SearchedHighAndLow, FollowedEveryHighway}: ClimbEveryMountain) => {
        this.FoundYourDream = ClimbedEveryMountain && SearchedHighAndLow && FollowedEveryHighway;
    }] as PropAction[];
    reactor = new Reactor(this);

    onPropChange(name: string, prop: PropDef, newVal: any){
        console.log("Been there, done that.");
        this.reactor.addToQueue(prop, newVal);
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

If all you want to do is fire off an event when a property is set, xtal-element supports defining "notifying" properties which will do that for you.  Likewise, if the only impact of the changed property is in what is displayed, that is supported by xtal-element's init and update transforms, discussed farther down.

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
        this.onPropChange('myProp');
    }
}
```

which is kind of a pain.  Furthermore sometimes you need to add logic that is tied to more than one property changing, so now you need to add a call to a common method, and there's no async support out of the box etc.:

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
        this.onPropChange('prop1');
    }

    _prop2 = 'myValue2';
    get prop2(){
        return this._prop2;
    }
    set prop2(nv){
        this.prop2 = nv;
        this.doSomeCommonLogic();
        this.onPropChange('prop2');
    }

    _prop3 = 'myValue3';
    get prop3(){
        return this._prop3;
    }
    set prop3(nv){
        this._prop3 = nv;
        this.doSomeCommonLogic();
        this.onPropChange('prop3');
    }

    prop4;

    doSomeCommonLogic(){
        //TODO:  debouncing
        this.prop4 = this.prop1 + this.prop2 + this.prop3;
    }
}
```

### A tribute to attributes [TODO]

The custom element specs provide for a way to monitor for attribute changes.  xtal-element provides a tiny bit of help with using that -- the getSlicedPropDefs function groups the props by type, so you can use that to help create the flat array of strings to monitor for.  The function camelToLisp may also come in handy if you want to use dash separators in your attribute names.  Going beyond that, xtal-element is reluctant to go, as it could mean instigating a chain of classes to inherit from.  

In particular, xtal-element lacks much support for supporting live attribute changes thus far.  Supporting this feature may be extremely important when working with a DOM-challenged framework.  But another use case dear to xtal-element's heart is the disabled attribute.

But xtal-element has grown somewhat skeptical of some of the [best practices advice](https://developers.google.com/web/fundamentals/web-components/best-practices) as far as reflecting primitives by default.  In order to avoid infinite loops, they suggest making the attribute the source of truth, essentially.  But that means every time you read a numeric property, it is having to parse the string.  (Their advice on Boolean properties seems less problematic).  Regardless, it doesn't match the behavior of native-born elements, which seem to deviate quite a bit from the best practices advice, and it seems that naturalized custom elements are already facing [enough struggles as it is](https://github.com/facebook/react/issues/11347#issuecomment-725487281), wanting to be treated the same as native-born's.

On the other hand, working with native-born elements, like the iframe and hyperlinks, it [can be frustrating](https://discourse.wicg.io/t/reflecting-prop-changes/5049) when we *can't* reflect to attributes, as it would be quite useful for styling purposes. 

xtal-element believes, first and foremost, in empowering the developer, the consumer of the web components built with xtal-element.  So how to balance all these concerns?

First, xtal-element supports the ability for a property to always reflect, but to "data-[lisp-case-of-property]-is=' -- in order to guarantee no infinite loop issues [TODO].

```html
<my-custom-element data-href-is="//example.com"></my-custom-element>
```

For properties that don't reflect automatically, xtal-element supports an attribute/property, "be-reflective/beReflective", which applies to that instance[TODO]:

```html
<my-custom-element be-reflective='["href", "disabled", "myProp"]'></my-custom-element>
```

This will also reflect to "data-[lisp-case-of-property]-is="

xtal-element supports a function to help in the implemented attributeChangedCallback method[TODO]:

```TypeScript
passAttrToProp<T extends HTMLElement = HTMLElement>(self: T, slicedPropDefs: SlicedPropDefs, name: string, oldValue: string, newValue: string);
```




### Observable Property Groups

To make the code above easier to manage, you can stick with simple fields for all the properties, and implement the property "propActions":

```JavaScript
export class MyCustomElement extends HTMLElement  implements ReactiveSurface{

    ...
    self = this;
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

The Reactor class/object will invoke this action anytime prop1, prop2 and/or prop3 change.

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
    self = this;

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

Separating "propAction" arrow functions out of the class as an (imported) constant imposes an additional limitation -- a limitation that isn't applicable when the actions are defined inside the class -- these external constants don't support responding to, or modifying, private members (something in the middle stages of browser and TypeScript adoption).  I thought using "bind" might give access to private fields, but no such luck.  The propActions public field, of course, allows a mixture of inline, instance-based propActions, empowered with access to private members, combined with the more limited (but portable, individually testable) external lambda expressions. So when private member access is needed, those actions could remain inside the class.

### Priors

The resemblance of these "propActions" to Rust trait implementations, a connection made above, is a bit superficial.  They're closer in spirit to computed values / properties with one significant difference -- they aggressively *push / notify* new values of properties, which can trigger targeted updates to the UI, rather than passively calculating them when requested (like during a repeated global render process).  And since we can partition rendering based on similar property groupings, we can create pipeline view updates with quite a bit of pinpoint accuracy.  

It's possible that libraries that don't support this kind of property change "diffraction", but rely on "template-optimized re-rendering" of the entire UI with every property change, end up also avoiding unnecessary updates, based on their clever diff-engine algorithms.  I can say as a user of a limited number of such libraries, that what is actually getting updated, when and why, has always a bit of a mystery for me, so that I end up "winging it" more often than I'd like.  This library puts the onus (and power) in the developer's hands to devise (and fully understand) their own strategy, not sparing the developer the details of the trade offs. 

I hasten to add that [watching a group of properties doesn't](https://medium.com/@jbmilgrom/watch-watchgroup-watchcollection-and-deep-watching-in-angularjs-6390f23508fe) appear to be a [wholly new concept, perhaps](https://guides.emberjs.com/v1.10.0/object-model/observers/#toc_observers-and-asynchrony).


Another benefit of "bunching together" property change actions: XtalElement optionally supports responding to property changes asynchronously.  As a result, rather than evaluating this action 3 times, it may only be evaluated once, with the same result.  Note that this async feature is opt in (by configuring the desired properties via "async" boolean setting).

After experimenting with different naming patterns, personally I think if you choose to separate out these prop actions into separate constants, names like "linkProp4" is (close to?) the best naming convention, at least for one common scenario.  Often, but not always, these property group change observers / actions will result in modifying a single different property, so that computed property becomes actively "linked" to the other properties its value depends on. So the name of the "property group watcher" could be named link[calculatedPropName] in this scenario.  Not all propActions will result in preemptively calculating a single "outside" property whose value depends on other property values, hence we stick with calling this orchestrating sequence "propActions" rather than "propLinks" in order to accommodate more scenarios. 

It's been my (biased) experience that putting as much "workflow" logic as possible into these propActions makes managing changing properties easier -- especially when working with asynchronous actions, and if the propActions are arranged in a logical order based on the flow of data, similar in concept perhaps to RxJs, where property groupings become the observables, and "subscriptions" based on resulting property changes come below the observable actions.  

### Debugging Disadvantage

One disadvantage of using propActions, as opposed to setter methods / class methods, is with the latter approach, one can step through the code throughout the process.  Doing so with propActions isn't so easy, so one is left wondering where the code will go next after the action is completed.

To address this concern, you can optionally implement the method:  

```JavaScript
propActionsHub(propAction){
    console.log(propAction); //or whatever helps with debugging
}
```

</details>

</details>

## Development Section

The next few sections are going to prove to be a bit dry reading.  Think of it as the [boring](https://youtu.be/okWr-tzwOEg?t=78) [development](<https://en.wikipedia.org/wiki/Violin_Sonata_No._9_(Beethoven)>) [section](https://en.wikipedia.org/wiki/Musical_development) of a sonata.

Previously, the way xtal-element handled visual updates was in a way that closely resembled the "reactor" functionality, but there was no unifying force, and also picking and choosing which libraries to use was overly complicated, resulting in larger than needed base footprint..

What we will be discussing for a while will finally lead up to our rendering approach, but first we must go through some [exercises](https://youtu.be/TPtDbHXkDp4?t=187) to get there.

### Planting flags in a cloned template

xtal-element provides a function, pinTheDOMToKeys, for creating symbolic references:

```JavaScript
const s = '';
const p = symbol();
const refs = {
    myDivId: '',
    myOtherId: '',
    somePart: s,
    someClass: s,
    mainElement: Symbol(),
    myDataFlagData = p
    someOtherClass = s
    someCustomElementElement = p
}
const cache = {};
pinTheDOMToKeys(domFragment: DOMFragment | HTMLElement, refs, cache);
```
It doesn't really matter what the right-hand-side of each expression inside refs is -- pinTheDOMToKeys will replace them by unique symbols if needed.

The cache can then be used to retrieve the unique matching element from the domFragment:

```JavaScript
const myDiv = cache[refs.myDivId];
```

The ending of each key is important.  pinTheDOMToKeys supports binding by id, part, class attributes, by element name ('Element'), and by Dataset ('Data'), depending on the ending of the key.  The part before the search type (e.g. Id, Part, etc) is turned into lisp-case before searching for it.

Only the first matching element is put into the cache.  If the element isn't found, the key is deleted from the cache.

### Ignoring prop changes when the new value is undefined or null.

We can specify to not react to changes of a property when it is falsy:

```JavaScript
{
    type: Object,
    stopReactionsIfFalsy: true
}
```

Let's see what we have so far, implementing the standard increment/decrement component showcased on [webcomponents.dev](https://webcomponents.dev/).  Note that this is not an exact comparison between apples and apples.  The vanilla component showcased by webcomponents.dev, for example, has no support for passing in the count via an attribute, or asynchronously passing in the count property, or caching DOM elements, micro-frontend parallel versions, asynchronous reactions, etc.  The example shown below (if you expand) supports all these features.  Import statements are not shown, to avoid further embarrassment.  If you don't need these features, then the vanilla component showcased by webcomponents.dev is perfectly compatible with xtal-element.

<details>
    <summary>Spot Check I - counter-do</summary>

```TypeScript
const mainTemplate = html`
<button part=down data-d=-1>-</button><span part=count></span><button part=up data-d=1>+</button>
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
const propDefGetter : destructPropInfo[] = [
    ({clonedTemplate, domCache}: CounterDo) => ({
        type: Object,
        stopReactionsIfFalsy: true
    }),
    ({count}: CounterDo) => ({
        type: Number
    })
];
const propDefs = getPropDefs(propDefGetter);
const slicedPropDefs = getSlicedPropDefs(propDefs);
const refs = { downPart: '', upPart: '', countPart: '' };

export class CounterDo extends HTMLElement implements CounterDoProps{
    static is = 'counter-do';
    clonedTemplate: DocumentFragment | undefined;
    domCache: any;
    count!: number;
    connectedCallback(){
        this.attachShadow({mode: 'open'});
        const defaultValues: CounterDoProps = { count: 0};
        attr.mergeStr<CounterDoProps>(this, slicedPropDefs.numNames, defaultValues);
        propUp(this, slicedPropDefs.propNames, defaultValues);
        this.clonedTemplate = mainTemplate.content.cloneNode(true) as DocumentFragment;
    }
    onPropChange(name: string, prop: PropDef, nv: any){
        this.reactor.addToQueue(prop, nv);
    }
    propActions = [
        ({clonedTemplate}: CounterDo) => {
            const cache = {};
            pinTheDOMToKeys(clonedTemplate!, refs, cache);
            this.domCache = cache;
        },
        ({domCache, count}: CounterDo) => {
            domCache[refs.countPart].textContent = count.toString();
        },
        ({domCache, clonedTemplate}: CounterDo) => {
            domCache[refs.downPart].addEventListener('click', (e: Event) => {
                this.count--;
            });
            domCache[refs.upPart].addEventListener('click', (e: Event) => {
                this.count++;
            });
            this.shadowRoot!.appendChild(clonedTemplate);
            this.clonedTemplate = undefined;
        },
    ] as PropAction[];
    reactor = new Reactor(this);
}
letThereBeProps(CounterDo, slicedPropDefs.propDefs, 'onPropChange');
define(CounterDo);
```

</details>

For this simple "counter" web component, the code shown above (if you expand) is a good stopping point.  Everything else we will do with this example will amount to taking at most 3 lines of code, at most reducing them to 1 line of code, and one import statement, and that import may contain a paragraph worth of code.  Meaning, if you never plan to develop a more complex web component than the one shown above, you've passed the course!

### Property Hydration, in detail

Let's look at these five lines of code in our counter-do example above:

```JavaScript
const propDefs = getPropDefs(propDefGetter);
const slicedPropDefs = getSlicedPropDefs(propDefs);
...
connectedCallback(){
    ...
    const defaultValues: CounterDoProps = { count: 0};
    attr.mergeStr<CounterDoProps>(this, slicedPropDefs.numNames, defaultValues);
    propUp(this, slicedPropDefs.propNames, defaultValues);
    ...
}
```

These two functions, mergeStr, and propUp, can be used independently of each other, and don't impose any arbitrary data structure requirements.  They also try to minimize assumptions.

But the resulting code is a bit of a mind twister.

In English, what the code is trying to do is this: 

>If something passes in the count property while I was attaching myself to the Live DOM element, that takes precedence.  If not, check for a value from a corresponding attribute.  If no attribute is found, as a last resort, just set the initial count to a default value of 0.

Translating between the code and the paragraph above requires quite a bit of intimate knowledge about what the functions do (and realizing that what you read is the opposite order of how you would typically express this in English).  

So let's see if we can simplify these primitives into an easy to read single line of code.

```Typescript
hydrate<T extends Partial<HTMLElement> = HTMLElement>(self: T, propDefs: PropDef[], defaultVals: T);
```

or more simply (without the ceremony of typing):

```Typescript
hydrate(self, propDefs, defaultVals);
```

where self is the custom element instance.



### Reusable, Declarative, Reaction-Supplements (Rxn-Suppls)

Let's take another look at one of our earlier propActions:

```JavaScript
[({ClimbedEveryMountain, SearchedHighAndLow, FollowedEveryHighway}: ClimbEveryMountain) => {
    this.FoundMyDream = ClimbedEveryMountain && SearchedHighAndLow && FollowedEveryHighway;
}]
```

As with all our examples so far, this propAction doesn't actually *return* anything.  What should the reactor do with anything returned?

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
    },
    {
        type: HTMLDivElement,
        do: myHTMLDivProcessor
    }
]);
```

So if the right-hand-side of the action returns a string, pass the context to function myStringProcessor.  If it returns an array, use myArrayProcessor.

Now our "actions" don't *have* to have a function body to do anything.  If a rxn-suppl function of the reactor library can render a view for example, and it just needs some configuration passed in, you can specify it with an expression:

```JavaScript
({prop1}) => ({
    section:{
        h1: prop1
    }
})
```

This also allows us to use reactions as opportunities to pass declarative JSON-ish syntax to template transformers (for example), which we will see below.

But we're jumping ahead ouf ourselves.

Back to our Kreutzer exercises.

In our counter web component, let's make this code more declarative, as it is boilerplate code:


```JavaScript
({domCache, clonedTemplate}: CounterDo) => {
    domCache[refs.downPart].addEventListener('click', (e: Event) => {
        this.count--;
    });
    domCache[refs.upPart].addEventListener('click', (e: Event) => {
        this.count++;
    });
    this.shadowRoot!.appendChild(clonedTemplate);
    this.clonedTemplate = undefined;
},
```

We can replace this.count-- / this.count++ with a more powerful method capable of so much more:

```JavaScript
changeCount(delta: number){
    this.count += delta;
}
```

We can split the action in two, separating different concerns:

```JavaScript
({domCache}: CounterDo) => {
    domCache[refs.downPart].addEventListener('click', (e: Event) => {
        this.count--;
    });
    domCache[refs.upPart].addEventListener('click', (e: Event) => {
        this.count++;
    });
    
},
({domCache, clonedTemplate}: CounterDo) => {
    this.attachShadow({mode: 'open'});
    this.shadowRoot!.appendChild(clonedTemplate);
    this.clonedTemplate = undefined;
}
```



The first action can be replaced by:

```JavaScript
({domCache, changeCount}: CounterRe) => ([
    {[refs.downPart]: [,{click:[changeCount, 'dataset.d', parseInt]}]},
    {[refs.upPart]: [,{click:[changeCount, 'dataset.d', parseInt]}]}
]),
```

*if* we provide the following rxn-suppl:

```JavaScript
reactor = new Reactor(this, [
    {
        type: Array,
        do: doDOMKeyPEAction
    }
]);
```

Not the abbreviation "PE".  That stands for Properties/Events.

The array [,{click:[changeCount, 'dataset.d', parseInt]}] is a nested tuple.  The first, undefined element allow us to set prop vals.

The second element of the tuple is a mapping of declarative event handling.

If it had looked like this:  {click:changeCount}, which is supported, then the signature of changeCount would need to look like:

```TypeScript
changeCount(e: Event){
    ...
}
```

But we created a nice, pristine method which is UI neutral.  To allow us to do that, the tuple:  [changeCount, 'dataset.d', parseInt] means "call changeCount, but pass in the value you get after evaluated target.dataset.d, and applying parseInt to that value."

### Ditto reactions

This is pretty annoying to DRYophiles:

```JavaScript
[
    {[refs.downPart]: [,{click:[changeCount, 'dataset.d', parseInt]}]},
    {[refs.upPart]: [,{click:[changeCount, 'dataset.d', parseInt]}]}
]
```

We can DRYphon out the wasted typing, using ditto notation:

```JavaScript
({domCache, changeCount}: CounterRe) => ([
    {[refs.downPart]: [,{click:[changeCount, 'dataset.d', parseInt]}]},
    {[refs.upPart]: '"'}
]),
```

### Nested reactions

Reactions can be nested:

```TypeScript
    propActions = [linkFindingYourDream, [linkFindYourPlace]];
```

### Shareable Actions

The action:

```JavaScript
({domCache, clonedTemplate}) => {
    this.attachShadow({mode: 'open'});
    this.shadowRoot!.appendChild(clonedTemplate);
    this.clonedTemplate = undefined;
}
```

... is apt to be found in most every visual component, so long as all components use the names "domCache} and "clonedTemplate." In that case, we can share it by doing the following:

1.  Make sure this field is defined in the class:

```JavaScript
self = this;
```

2.  Now we can move the action out to a constant, and place it some common import for reduced bandwidth when developing multiple custom elements:

```JavaScript
const linkClonedTemplate = ({domCache, clonedTemplate, self}) => {
    self.attachShadow({mode: 'open'});
    self.shadowRoot!.appendChild(clonedTemplate);
    self.clonedTemplate = undefined;
}
```

### XtalPattern

The library XtalPattern removes as much of the common boilerplate as possible (without using class inheritance or mixins).  It provides a interface.  Implementing the interface with Typescript will hopefully help the developer remember what needs to be done for a complete component.

Using XtalPattern, our component now looks like what's shown below (after expanding)

<details>
    <summary>Spot Check II - counter-ro</summary>

```Typescript
const mainTemplate = html`
<button part=down data-d=-1>-</button><span part=count></span><button part=up data-d=1>+</button>
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
const refs = {downPart: '', upPart: '', countPart: ''};
const propActions = [
    xp.manageMainTemplate,
    ({domCache, count}: CounterRe) => ([
        {[refs.countPart]: [{textContent: count}]}
    ]),
    ({domCache, changeCount}: CounterRe) => ([
        {[refs.downPart]: [,{click:[changeCount, 'dataset.d', parseInt]}]},
        {[refs.upPart]: '"'}
    ]),
    xp.createShadow
] as PropAction[];
const propDefGetter : destructPropInfo[] = [
    xp.props,
    ({count}: CounterRe) => ({
        type: Number
    })
];
const propDefs = getPropDefs(propDefGetter);


export class CounterRe extends HTMLElement implements CounterDoProps, XtalPattern{
    static is = 'counter-re';
    reactor = new Reactor(this, [
        {
            type: Array,
            do: doDOMKeyPEAction
        }
    ]);
    clonedTemplate: DocumentFragment | undefined;
    domCache: any;
    count!: number;
    connectedCallback(){
        hydrate<CounterDoProps>(this, propDefs, {
            count: 0
        });
    }
    onPropChange(name: string, prop: PropDef, nv: any){
        this.reactor.addToQueue(prop, nv);
    }
    changeCount(delta: number){
        this.count += delta;
    }
    self = this;
    refs = refs;
    mainTemplate = mainTemplate;
    propActions = propActions;

}
letThereBeProps(CounterRe, propDefs, 'onPropChange');
define(CounterRe);
```
</details>

<details>
    <summary>Talking points</summary>

Note that we've moved some of the visual Rxn-Suppl's close to the template.  This is done in an effort to place highly related pieces close together.

Our class is whittling down now, so that the core buiness logic (count, changeCount) becomes easier to spot.

XtalPattern is continuing to impose more assumptions on names of properties -- in particular, mainTemplate, clonedTemplate, self, refs, domCache.
</details>

## Rendering Fluid Views