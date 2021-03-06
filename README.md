# xtal-element

<details>
    <summary>preramble</summary>

<details>
    <summary>FROOP Programming</summary>

xtal-element provides 

1.  An opinionated "pattern" for creating a web component.  It does this by providing a handful of utility functions and classes, which facilitate the process. 
2.  A base class which implements a combination of these functions, resulting in less boilerplate.

The great thing about web components is that they are the web equivalent of Martin Luther King's "I have a dream" speech.  Little web components built with tagged template literals can connect with little web components built with Elm, and web components will be judged by the content they provide, rather than superficial internal technical library choices. 

xtal-element adopts a number of "opinions" that may be best suited for some types of components / scenarios / developer preferences, but not necessarily everything.  

For example, an interesting duality paradox that has existed for a number of years has been between OOP vs functional programming.  Efforts to "embrace the duality paradox" like Scala and F# always appealed to me.  The "hooks" initiative adds an interesting twist to the debate, and might strike the right balance for some types of components.  Evidently, the result has been less boilerplate code, which can only be good.  Perhaps the learning curve is lower as well, and that's great.

xtal-element, though, embraces the duality paradox in a slightly different way.  It promotes sticking with classes as far as holding state (and has no issues with users of this library also implementing their business logic using standard OOP methodology -- methods, inheritance, etc.).  But xtal-element itself deviates considerably from standard OOP approaches in some critical ways.  

xtal-element borrows some ideas from Rust and Python.

</details>

<details>
<summary>Target Audience</summary>

xtal-element's target audience is those who are looking for web component helpers that:

1.  Will benefit from the implementation of HTML Modules -- the rendering library is focused around HTMLTemplateElement-based UI definitions, rather than JSX or tagged-template literals.
2.  Takes extensibility and separation of concerns to a whole other level.
3.  Provides first-class support for progressive enhancement, low bandwidth.
4.  Takes advantage of TypeScript (but use is entirely optional), so as to avoid "magic strings" as much as possible.   By "optional" I mean little to no extra work is required if you choose to forgo typescript. The syntax sticks exclusively to the browser's capabilities, with one partial exception. Import maps are now part of Chrome.  Here's to hoping import maps arrive in other browsers soon!  In the meantime, [a polyfill](https://github.com/guybedford/es-module-shims) which is compatible with the native syntax, and available [as a CDN link](https://jspm.org/import-map-cdn), is available.  
5.  Can easily separate, as well as group, different "concerns" as best fits the situation.  Some of xtal-element's utility functions adopt the philosophy that it makes sense to be able to easily partition properties into logical groups, and "react" when any of the grouped properties change.  This is done for both internal dependency calculations, as well as for visual updates.  Some reactions involve doing one-time tasks, like cloning / importing HTML Templates, and attaching event handlers.  Separate update processes can focus on passing in new data bindings as they change.  Keeping these two separate, and keeping the HTML Templates separate from binding mappings, may result in a bit more steps than other libraries, but hopefully the lack of magic /  increased flexibility(?) can pay off in some cases.  This separation of concerns could, in theory, be extended to support other processes -- including build and server component processes (to be explored.)
6.  Micro FrontEnd friendly versioning support.

</details>

<details>
    <summary>à la carte vs. buffet</summary>

## Another duality paradox

For many developers, a key criteria in evaluating which component library they like is based exclusively on how little "fuss" is required to create a new component.  I can totally relate to this concern.  However, in practice, there are two extremes to consider:  

1.  Creating, with tender loving care, a component meant to have a minimum footprint, while being highly reusable, leverageable in multiple frameworks / no frameworks, loading synchronously / asynchronously, bundled / not bundled, etc.
2.  RAD-style creation of a local component only to be used in a specific way by one application or one component.

There's a lot of room in between these two extremes that should also be supported.

The way xtal-element looks at this problem is via the à la carte vs. buffet duality paradox.

We'll first be laboriously walking through the primitive building blocks xtal-element provides, and see how the developer can pick and choose precisely which functions/classes to utilize.  If you are developing a non-visual component, why bear the weight of the visual display machinery, for example?  This *à la carte* approach is better suited for components that are closer in spirit to the first extreme listed above.

[Catalyst](https://github.github.io/catalyst/) takes the same approach.

If you want to skip over the tender loving care / tedious discussion needed for developing the first type of component, skip to [the low ceremony X base class discussion](https://github.com/bahrus/xtal-element#private-low-ceremony-xtal-components).  You may then want to slowly review the first sections as needed, in order to better understand the underpinnings.

</details> 

</details>

<details>
    <summary>Defining</summary>

## Let's start from the very beginning

The first thing you will want to do when defining a web component is to name it.  

Of course, [the platform has an api for that](https://developer.mozilla.org/en-US/docs/Web/API/CustomElementRegistry/define).

Polymer established a pattern whereby the source of truth for the name is provided by a static field, to more closely associate the class with the custom element name, essentially.  xtal-element continues this tradition (as there are subtle advantages to doing so, not explained here).

Currently, within a single document / application, that name must be unique.  This poses some contentious questions about what should happen if there's already a custom element with the same name.  xtal-element values Micro Frontends, and allows multiple versions running at the same time.  To accomplish this, xtal-element provides the following optional function for establishing the name of the component: 

```JavaScript
import {define} from 'xtal-element/lib/define.js';
export class DoReMi extends HTMLElement{
    static is = 'do-re-mi';
}
define(DoReMi);
```

Like Catalyst, you don't *have* to specify "is".  If you leave it off, there's a slight performance penalty, but the name will then be established by the lisp-case-name of the class ("do-re-me"). 

```JavaScript
import {define} from 'xtal-element/lib/define.js';
export class DoReMi extends HTMLElement{
}
define(DoReMi); //this works too!
```

To support Typescript-centric frameworks like Angular, you will also need:

```Typescript
declare global {
    interface HTMLElementTagNameMap {
        "do-re-mi": DoReMi,
    }
}
```

... either in the same file or a separate *.d.ts file.


<details>
    <summary>Lengthy explanation</summary>


As far as avoiding name conflicts, the best analogy for what xtal-element's "define" function does would be web servers that have a default port, but if that port is in use, it searches for a close by port not in use.

If another custom element is found matching the same name, the new custom element will be registered with the first non-taken number appended to the name.  Static prop 'isReally' allows consumers to know which tag name to use.  

So for the example above, regardless of whether a custom element already exists with name 'do-re-mi', you can reference the actual tag name via:

```JavaScript
import {DoReMi} from 'DoReMi/DoReMi.js';

const firstThreeNotes = document.createElement(DoReMi.isReally);
```

Most of the time, DoReMi.isReally will equal "do-re-mi" but sometimes it will be "do-re-mi-1", even more rarely it could be "do-re-mi-2", etc.

This solution works best for web components that either use a programmatic api as shown above, or use templates for the UI definition, as the template, or clone, can be dynamically modified to adjust the element names prior to landing inside the live DOM tree.

</details>

</details>

<details>
    <summary>PropDefs</summary>

## Let there be props

xtal-element has a Typescript Interface "PropDef" that it uses to define the characteristics of a property.

```Typescript
export interface PropDef{
    /** Name of property */
    name?: string;
    /**
     * The type of the property.  If you don't want any support for attributes, use "Object" even if it is a number/string/boolean.
     */
    type?: Boolean | String | Number | Object;
    /**
     * Reflect property changes to data-*
     */
    reflect?: boolean;
    /**
     * Spawn non-bubbling custom event when property changes.  Name of event is [lisp-case-of-property-name]-changed.
     */
    notify?: boolean;
    /**
     * Parse corresponding (lisp-cased of property name) attribute as JSON string for Object type properties
     */
    parse?: boolean;
    /**
     * Don't do anything if new value is the same as the old value.
     */
    dry?: boolean;
    /**
     * Console.log when property changes
     */
    log?: boolean;
    /**
     * Insert debugger breakpoint when property changes
     */
    debug?: boolean;
    /**
     * React to property change asynchronously
     */
    async?: boolean;
    /**
     * Block reactions containing this property if property is falsy
     */
    stopReactionsIfFalsy?: boolean;
    /**
     * Block reactions containing this property if property is truthy
     */
    stopReactionsIfTruthy?: boolean;
    /**
     * Copy property value to another value specified by echoTo
     */
    echoTo?: string;
    /**
     * Make property read-easily, write obscureky
     */
    obfuscate?: boolean;
    /**
     * Alias for obfuscated properties
     */
    alias?: string;
    /**
     * Delete this property after the specified number of milliseconds. 
     */
    transience?: number;
    /**
     * Do not trigger any reactions, but merge this object into the custom element instance using object.assign.
     * This is useful for client-side hydrating of already server-side-rendered content.
     */
    syncProps?: any;

    /**
     * Provide a default value (if using the mergeProps function) *only if* this attribute is not present.
     * If the attrib is present, the assumption is that the property will be set externally, and the default value thrown away,
     * so this avoids wasted effort involved in setting the initial value.
     */
    byoAttrib?: string;

    /**
     * Make a deep copy of objects that are passed in.
     */
    clone?:  bool;
}
```

So you can define a propDefs object that lists all the properties, as shown below.  


```Typescript
import {letThereBeProps} from 'xtal-element/lib/letThereBeProps.js';
import {PropDefMap} from 'xtal-element/types.d.js';

const propDefMap : PropDefMap<MyFavoriteThings> = {
    BrownPaperPackagesTiedUpWith: {
        type: String,
    }
}
const slicedPropDefs = getSlicedPropDefs(propDefMap);

export class MyFavoriteThings extends HTMLElement{
    onPropChange(name, prop, newValue){
        console.log(prop);
    }
}
letThereBeProps(MyFavoriteThings, slickedPropDefs, 'onPropChange');
```

The third parameter, 'onPropChange' is optional.

</details>

<details>
    <summary>Read-easily, write-obscurely properties</summary>

One sticky point with web components, and this library in particular, is how to indicate properties that are meant to be passed in from outside, vs. "private" properties that hold internal state.  (This distinction figures prominently in popular frameworks.)

Perhaps the newly implemented private property support for classes can help with this, but xtal-element provides more robust support for an alternative.  We want a property to be easily read (both internally as well as externally), but whose value is only set internally.

To support this, add the obfuscate setting:

```JavaScript
const propDefMap = {
    myProp: {
        obfuscate: true,
    }
};
const slicedPropDefs = getSlicedPropDefs(propDefMap); 
```

Now to read the value of myProp, we use this.myProp or self.myProp, or $0.myProp from the DevTools console.

But to set the value of myProp, we now need to do this:

```JavaScript
self[slicedPropDefs.propLookup.myProp.alias] = newValue;
```

</details>


<details>
    <summary>Prop initialization, part I</summary>

## Support for asynchronous loading

If prop values might be passed to an element before the [element becomes registered](https://developers.google.com/web/fundamentals/web-components/best-practices#lazy-properties) (always best to be prepared for this to happen), then you can account for this by utilizing the "propUp" function:

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
</details>

<details>
<summary>Rx</summary>

## Reactive Prop Actions

```TypeScript
import {Rx} from 'xtal-element/lib/Rx.js';
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
    reactor = new Rx(this);

    onPropChange(name: string, prop: PropDef, newVal: any){
        console.log("Been there, done that.");
        this.reactor.addToQueue(prop, newVal);
    }

}
```

**NB**:  I've recently learned that defining non-initialized class fields as shown above, will result in property values, passed asynchronously to the unknown element prior to being upgraded, being lost on the upgrade.

Meaning the code, elegant as it looks, and convenient as it is for TypeScript Typing, is ultimately problematic.  Better to stick with interfaces and PropDefMap's exclusively, as outlined previously, when defining properties.

<details>
    <summary>Detailed Explanation</summary>

## Setter logic

Defining a new property is, by design, meant to be as easy as possible:

```Typescript
export class MyCustomElement extends HTMLElement{
    myProp:string;
}
```

**NB**:  See previous NB for why the example above is problematic for other reasons.

The problem arises when something special needs to happen when myProp's value is set.  

If all you want to do is fire off an event when a property is set, xtal-element supports defining "notifying" properties which will do that for you.  Likewise, if the only impact of the changed property is in what is displayed, that is supported in ways discussed farther down.

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

propActions rely heavily on destructuring the class as the argument of an arrow function.  JavaScript doesn't appear to support destructuring objects with ES6 symbols as keys.

Separating "propAction" arrow functions out of the class as an (imported) constant imposes an additional limitation -- a limitation that isn't applicable when the actions are defined inside the class -- these external constants don't support responding to, or modifying, private members (something in the middle stages of browser and TypeScript adoption).  I thought using "bind" might give access to private fields, but no such luck.  The propActions public field, of course, allows a mixture of inline, instance-based propActions, empowered with access to private members, combined with the more limited (but portable, individually testable) external lambda expressions. So when private member access is needed, those actions could remain inside the class.

### Priors

The resemblance of these "propActions" to Rust trait implementations, a connection made above, is a bit superficial.  They're closer in spirit to computed values / properties with one significant difference -- they aggressively *push / notify* new values of properties, which can trigger targeted updates to the UI, rather than passively calculating them when requested (like during a repeated global render process).  And since we can partition rendering based on similar property groupings (discussed below), we can create pipeline view updates with quite a bit of pinpoint accuracy.  

It's possible that libraries that don't support this kind of property change "diffraction", but rely on "template-optimized re-rendering" of the entire UI with every property change, end up also avoiding unnecessary updates, based on their clever diff-engine algorithms.  I can say as a user of a limited number of such libraries, that what is actually getting updated, when and why, has always a bit of a mystery for me, so that I end up "winging it" more often than I'd like.  This library puts the onus (and power) in the developer's hands to devise (and fully understand) their own strategy, not sparing the developer the details of the trade offs. 

I hasten to add that [watching a group of properties doesn't](https://medium.com/@jbmilgrom/watch-watchgroup-watchcollection-and-deep-watching-in-angularjs-6390f23508fe) appear to be a [wholly new concept, perhaps](https://guides.emberjs.com/v1.10.0/object-model/observers/#toc_observers-and-asynchrony).


Another benefit of "bunching together" property change actions: XtalElement optionally supports responding to property changes asynchronously.  As a result, rather than evaluating this action 3 times, it may only be evaluated once, with the same result.  Note that this async feature is opt-in (by configuring the desired properties via "async" boolean setting).

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

### Externally subscribing to property changes

The Rx class has a method, "subscribe" that allows for externally subscribing to property changes.  Method "unsubscribe" does the reverse.

```TypeScript
subscribe(propsOfInterest: Set<string>, callBack: (rs: ReactiveSurface) => void);
unsubscribe(propsOfInterest: Set<string>, callBack: (rs: ReactiveSurface) => void);
```

</details>

</details>

</details>

<details>
    <summary>Incremental Improvements</summary>

## Development Section

The next few sections are going to prove to be a bit dry reading.  Think of it as the [boring](https://youtu.be/okWr-tzwOEg?t=78) [development](https://en.wikipedia.org/wiki/Musical_development) section of a [sonata](<https://en.wikipedia.org/wiki/Violin_Sonata_No._9_(Beethoven)>).

Previously, the way xtal-element handled visual updates was in a way that closely resembled the "reactor" functionality, but there was no unifying force, and also picking and choosing which libraries to use was overly complicated, resulting in larger than needed base footprint..

What we will be discussing for a while will finally lead up to our rendering approach, but first we must go through some [exercises](https://youtu.be/TPtDbHXkDp4?t=187) to get there.



<details>
    <summary>pinTheDOMToKeys</summary>

### Planting flags in a cloned template

xtal-element provides a function, pinTheDOMToKeys, for creating symbolic references to DOM elements in a cloned template:

```html
<waltz-es on=way to=Mass part=she-is-a-pain class=will-o-the-wisp>Whistles on the stair</waltz-es>
<singing-aloud in-the-abbey part=she-is-a-pain>Late for chapel</singing-aloud>
<moon-beam class=hand>Catching clouds</moon-beam>
<div data-word=flibbertijibbet >Maria</div>
<span data-word=clown>Riddle</span>

<script>
const refs = {
    sheIsAPainParts: '.will-o-the-wisp',
    moonBeamElement: '.hand',
    dataWordAttribs: '',

}
const cache = {};
pinTheDOMToKeys(domFragment: DOMFragment | HTMLElement, refs, cache);
</script>
```

The ending of each key is important.  pinTheDOMToKeys supports binding by id, part, class attributes, by element name, and by attribute, depending on the ending of the key.  The part before the search type (e.g. Id, Part, etc) is turned into lisp-case before searching for it.  The right hand expression can be used to apply filtering on the results, based on standard css matching.

<table>
    <tr>
        <th>Ending</th><th>Example</th><th>Query that is used</th><th>Notes</th>
    </tr>
    <tr>
        <td>Part</td><td>myFirstPart</td><td>.querySelector('[part*="my-first"])</td><td>May find false positives when working with multiple parts on the same element</td>
    </tr>
    <tr>
        <td>Parts</td><td>allInTheFamilyParts</td><td>.querySelectorAll('[part*="all-in-the-family"])</td><td>Ibid</td>
    </tr>
    <tr>
        <td>Attrib</td><td>bopBopBaDopAttrib</td><td>.querySelector('[bop-bop-ba-dop]')</td><td>&nbsp;</td>
    </tr>
    <tr>
        <td>Attribs</td><td>balanceDataAttribs</td><td>.querySelectorAll('[data-balance]')</td><td>&nbsp;</td>
    </tr>
    <tr>
        <td>Element</td><td>ironElement</td></td><td>.querySelector('iron')</td><td>&nbsp;</td>
    </tr>
    <tr>
        <td>Elements</td><td>myCustomElements</td><td>.querySelectorAll('my-custom')</td><td>&nbsp;</td>
    </tr>
    <tr>
        <td>Id</td><td>frenchEvolutionId</td><td>.querySelector('#french-evolution')</td><td>&nbsp;</td>
    </tr>
    <tr>
        <td>Class</td><td>workingClass</td><td>.querySelector('.working')</td><td>&nbsp;</td>
    </tr>
    <tr>
        <td>Classes</td><td>crabGrassClasses</td><td>.querySelectorAll('.crab-grass')</td><td>&nbsp;</td>
    </tr>
</table>


In the case of plural selections (...Elements, ...Parts, etc), if the right-hand-side (rhs) of each refs sub-expression is not an empty string, it is then used to filter out that list via element.matches(rhs). pinTheDOMToKeys will always replace the rhs with a unique symbol for later reference.

The cache can then be used to retrieve the matching element(s) from the domFragment:

```JavaScript
const moonBeam = cache[refs.moonBeamElement];
const painParts = cache[refs.sheIsAPainParts];
```

</details>



<details>
    <summary>stopReactionsIfFalsy/Truthy</summary>

### Ignoring prop actions when one or more dependency value is falsy/truthy.

This is one of the trickier aspects of this library.

Frequently it arises that a number of propActions depend on a key property, and *none* of those actions make sense to execute unless that property is not falsy.  domCache is one such property, since many propActions which depend on domCache will be focused around binding elements from the domCache.  So that means lots of undefined checks in each propAction:

```JavaScript
({domCache, count}: CounterDo) => {
    if(domCache === undefined) return;
    domCache[refs.countPart].textContent = count.toString();
},
```

To avoid this nuisance, we can specify that *any and all* propActions depending on this property should not be executed until the property is not falsy:

```JavaScript
domCache: {
    type: Object,
    stopReactionsIfFalsy: true
}
```

### Two special properties:  disabled and deferHydration

The propActions orchestrator, Rx, recognizes two properties, which, if either is true, means to cease any "reactions" -- disabled and [deferHydration](https://github.com/webcomponents/community-protocols/issues/7)[TODO]. 

</details>

<details>
    <summary>transient properties</summary>

xtal-element encourages heavy use of "reactive" properties, combined with standalone functions, in contrast to more traditional methods.  This approach in turn tends to encourage wider use of properties, even to store values for short periods of time.  To reduce memory overhead, the developer should then take steps to delete these transient properties when not needed.

To make this easier to manage, transient properties can be defined declaratively:

```TypeScript
export const prop : PropDef = {
    transience: 5000,
}
```

The trigger for when to delete such properties happens after retrieving the value.  If the value is defined, the value will be returned that first time, but, if transience has value 0, it will be immediately deleted from memory, so the second time the property value is read, it will now be undefined.  If the value of transience is larger than 0, it will wait the specified number of milliseconds before deleting the value from memory.  Use this feature carefully.

</details>

Let's see what we have so far, implementing the standard increment/decrement component showcased on [webcomponents.dev](https://webcomponents.dev/).  Note that this is not an exact comparison between apples and apples.  The vanilla component showcased by webcomponents.dev, for example, has no support for passing in the count via an attribute, or asynchronously passing in the count property, or caching DOM elements, Micro Frontend parallel versions, asynchronous reactions, etc.  The example shown below (if you expand) supports all these features.  If you don't need these features, then the vanilla component showcased by webcomponents.dev is perfectly compatible with xtal-element.  Import statements are not shown, to avoid further embarrassment.  

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

const refs = { downPart: '', upPart: '', countPart: ''};

export class CounterDo extends HTMLElement implements CounterDoProps{
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
        ({domCache}: CounterDo) => {
            domCache[refs.downPart].addEventListener('click', (e: Event) => {
                this.count--;
            });
            domCache[refs.upPart].addEventListener('click', (e: Event) => {
                this.count++;
            });
            this.shadowRoot!.appendChild(this.clonedTemplate!);
            delete this.clonedTemplate;
        },
    ] as PropAction[];
    reactor : IReactor = new Rx(this);
    
}
const nonFalsyObject: PropDef = {
    type: Object,
    stopReactionsIfFalsy: true
};
const propDefs: PropDefMap<CounterDo> = {
    clonedTemplate: nonFalsyObject,
    domCache: nonFalsyObject,
    count: {
        type: Number
    }
};

const slicedPropDefs = getSlicedPropDefs(propDefs);
letThereBeProps(CounterDo, slicedPropDefs, 'onPropChange');
define(CounterDo);
```

</details>

For this simple "counter" web component, the code shown above (if you expand) is a good stopping point.  Everything else we will do with this example will amount to taking at most 3 lines of code, at most reducing them to 1 line of code, and one import statement, and that import may contain a paragraph worth of code.  Meaning, if you never plan to develop a more complex web component than the one shown above, you've passed the course!

<details>
    <summary>Prop Initialization, Part II</summary>

### Property initializing, in detail

Let's look at these five lines of code in our counter-do example above:

```JavaScript
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

These two functions, mergeStr, and propUp, can be used independently of each other, and don't impose any arbitrary data structure requirements (in particular the PropDef structure).  The functions try to minimize assumptions, in other words.

But the resulting code is a bit of a mind twister.

In English, what the code is trying to do is this: 

>If something passes in the count property while I was attaching myself to the Live DOM element, that takes precedence.  If not, check for a value from a corresponding attribute.  If no attribute is found, as a last resort, just set the initial count to a default value of 0.

Translating between the code and the paragraph above requires quite a bit of intimate knowledge about what the functions do (and realizing that what you read is the opposite order of how you would typically express this in English).  

So let's see if we can simplify these primitives into an easy to read single line of code.

```Typescript
mergeProps<T extends Partial<HTMLElement> = HTMLElement>(self: T, propDefs: PropDef[], defaultVals: T);
```

or more simply (without the ceremony of typing):

```Typescript
mergeProps(this, propDefs, defaultVals);
```

where "this" is the custom element instance.

"mergeProps" should continue to be called within the connectedCallback lifecycle event.

</details>

<details>
<summary>passAttrToProp</summary>

### A tribute to attributes

The custom element specs provide for a way to monitor for attribute changes.  xtal-element provides some helper functions for that, which you can pick and choose from -- 

1.  The getSlicedPropDefs function groups the PropDefs by type, so you can use that to help create the flat array of strings to monitor for.  
2.  The function camelToLisp may also come in handy if you want to use dash separators in your attribute names.  
3.  A helper function "passAttrToProp" can be placed as the body of the attributeChangedCallback:


```TypeScript
attributeChangedCallback(name: string, oldValue: string, newValue: string){
    passAttrToProp(this, slicedPropDefs, name, oldValue, newValue);
}

```

This function will **only work properly in combination with the mergeProps function mentioned above.** 


But xtal-element has grown somewhat skeptical of some of the [best practices advice](https://developers.google.com/web/fundamentals/web-components/best-practices) as far as reflecting primitives by default.  In order to avoid infinite loops, they suggest making the attribute the source of truth, essentially.  But that means every time you read a numeric property, it is having to parse the string.  (Their advice on Boolean properties seems less problematic).  Regardless, it doesn't match the behavior of native-born elements.  Naturalized custom elements are already facing [enough struggles as it is](https://github.com/facebook/react/issues/11347#issuecomment-725487281), wanting to be treated the same as native-born's.  Deviations from what native-born elements do will likely lead to more recriminations, I'm sure.

On the other hand, working with native-born elements, like the iframe and hyperlinks, it [can be frustrating](https://discourse.wicg.io/t/reflecting-prop-changes/5049) when we *can't* reflect to attributes, as it would be quite useful for styling purposes. 

xtal-element believes, first and foremost, in empowering the developer, the consumer of the web components built with xtal-element.  So how to balance all these concerns?

First, xtal-element supports the ability for a property to always reflect, but to "data-[lisp-case-of-property]-is=" -- in order to guarantee no infinite loop issues.


```html
<my-custom-element href="//example.com" data-href-is="//example.com"></my-custom-element>
```

In the example above, if the href *property* is set, nothing happens to the href attribute, only the data-href-is attribute is modified (if "reflect" is turned on for the href property).

Ideally, in the future, the [custom pseudo state](https://www.chromestatus.com/feature/6537562418053120) proposal will gain more momentum, which would replace the "data-[lisp-case-of-property]-is=" approach above.

For properties that don't reflect automatically, custom elements that implement the XtalPattern (discussed below) supports an attribute/property, "be-reflective/beReflective", which applies to that instance:

```html
<my-custom-element be-reflective='["href", "disabled", "myProp"]'></my-custom-element>
```

This will also reflect to "data-[lisp-case-of-property]-is=" (for now, until custom pseudo state is a thing).

This gives a consumer of the web component the power to get the behavior they need, instance by instance.

Or they can extend the web component, and set beReflective in the constructor, if needed all the time.

</details>



<details>
    <summary>Be Noticed</summary>

### Custom events [TODO]

PropDef supports specifying that when a property changes, it should emit an event.

But, like with the be-reflective option mentioned above, events can also be tailored on an instance level:

```html
<my-custom-element be-noticed='["href", "disabled", {"myProp":{"bubbles": true}]'></my-custom-element>
```

</details>

<details>
    <summary>Rx-Suppls</summary>

### Reusable, Declarative, Reactor-Supplements (Rx-Suppls)

Let's take another look at one of our earlier propActions:

```JavaScript
({ClimbedEveryMountain, SearchedHighAndLow, FollowedEveryHighway}: ClimbEveryMountain) => {
    this.FoundMyDream = ClimbedEveryMountain && SearchedHighAndLow && FollowedEveryHighway;
}
```

As with all our examples so far, this propAction doesn't actually *return* anything.  What should the propActions Rx orchestrator do with anything returned?

In fact, the library xtal-element/lib/Rx.js doesn't support doing anything with what is returned.  The thinking is that the feature discussed below will primarily be used for visual components, where the developer wants to adopt declarative syntax.  Larger projects will tend to make it worthwhile to ask developers to grok this additional concept.

So there is a more feature-rich reactive library:  'xtal-element/lib/RxSuppl.js' which can do something with what is returned.

We can specify that using a return mapping:

```TypeScript
import {myStringProcessor, myArrayProcessor}
reactor = new RxSuppl(this, [
    {
        rhsType: String,
        ctor: myStringProcessor
    },
    {
        rhsType: Array,
        ctor: myArrayProcessor
    },
    {
        rhsType: HTMLDivElement,
        ctor: myHTMLDivProcessor
    }
]);
```

Here "rhs" stands for right-hand-side, and ctor stands for "class constructor."

So if the right-hand-side of the action returns a string, pass the context to an instance of class myStringProcessor.  If it returns an array, use myArrayProcessor.  Etc.

*Now* our "actions" don't *have* to have a function body to do anything.  If a rx-suppl function passed into RxSuppl can render a view, for example, and it just needs some configuration passed in, you can specify it with an expression:

```JavaScript
({prop1}) => ({
    section:{
        h1: prop1
    }
})
```

But we're jumping ahead of ourselves.

Back to our Kreutzer exercises.

</details>

<details>
    <summary>Attaching events / setting props</summary>

## Binding

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

We can replace this.count-- / this.count++ with a more powerful method, defined in our class CounterDo, capable of so much more:

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
({domCache, changeCount}: CounterRe) => [
    {[refs.downPart]: [,{click:[changeCount, 'dataset.d', parseInt]}]},
    {[refs.upPart]: [,{click:[changeCount, 'dataset.d', parseInt]}]}
],
```

*if* we provide the following rxn-suppl:

```JavaScript
reactor = new RxSuppl(this, [
    {
        rhsType: Array,
        ctor: DOMKeyPE
    }
]);
```

Note the abbreviation "PE".  That stands for Properties/Events.

The array [,{click:[changeCount, 'dataset.d', parseInt]}] is a nested tuple.  The first, undefined (in this case) member of the tuple allows us to set prop vals.

The second element of the tuple is a mapping of declarative event handling.

If it had looked like this:  {click:changeCount}, which is supported, then the signature of changeCount would need to look like:

```TypeScript
changeCount(e: Event){
    ...
}
```

But our first changeCount method is a nice, pristine method which is UI neutral.  To allow us to bind to that, the tuple:  [changeCount, 'dataset.d', parseInt] means "call changeCount, but pass in the value you get after evaluating target.dataset.d, and applying parseInt to that value."

### Setting attributes

If you need to use attributes, then import the slightly larger DOMKeyPEA 'xtal-element/lib/DOMKeyPEA.js';

Now the third element of the RHS array is where you can set attributes (a value of null removes the attribute).

<details>
    <summary>DOMKeyPE[A] in detail</summary>

The doDOMKeyPEAction expression:

```JavaScript
[
    {[refs.downPart]: [,{click:[changeCount, 'dataset.d', parseInt]}]},
    {[refs.upPart]: [,{click:[changeCount, 'dataset.d', parseInt]}]}
],
```

Is an array.  The processor expects one of two types of things inside the array:

1.  Objects
2.  Arrays

In the example above, both of the lines inside the outer array are objects.  In this case, the LHS is expected to be a symbolic reference to a DOM element, or multiple DOM elements (via the domCache property).  And the right hand side is a props / event tuple, as we mentioned.

But you can also include an array in the expression:

```JavaScript
[
    {[refs.downPart]: [,{click:[changeCount, 'dataset.d', parseInt]}]},
    {[refs.upPart]: [,{click:[changeCount, 'dataset.d', parseInt]}]},
    [finishedSettingProps: true]
],
```

This can act as a "post-binding" prop setting of the host element itself.  This can allow us to declaratively continue the processing "chain" of reactions -- "bind these elements / add event handlers, then set property "finishedSettingProps" to true, which another "propAction" reaction can then, well, react to.

## Setting textContent

If you just want to set the textContent property of a pinned DOM element, make the RHS a string:

```JavaScript
[
    {[refs.countPart]: count.toString()
],
```

## Using DOMKeyPE[A] to substitute one tag for another

Much earlier, we described how xtal-element's define function dynamically sets the custom element name, under certain conditions, in order to support multi-versioning.  We mentioned this is only useful if the tag inside the cloned template can be replaced by the dynamically determined tag name.

There are also quite a number of other scenarios where being able to substitute in a static tag name with a dynamic one is useful.  It comes up frequently when working with generic JSON structures, where polymorphism is used between different component types.

If the first element of the RHS array has property "localName", then this will replace the tag:

```JavaScript
({domCache, name}: SwagTagInstance) => [
    {[refs.placeHolderElement]: [{localName: name}]},
],
```

</details>

<details>
    <summary>Named PropActions [TODO]</summary>

    Two Utility functions:
    
1.  One takes JSON-like tree structure of PropActions, and flattens into an array.
2.  Another that applies inheritance-like merging of an enhancing PropAction tree on top of an existing one.


</details>

</details>

<details>
    <summary>'"'</summary>

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
({domCache, changeCount}: CounterRe) => [
    {[refs.downPart]: [,{click:[changeCount, 'dataset.d', parseInt]}]},
    {[refs.upPart]: '"'}
],
```

</details>

<details>
    <summary>Unnecessarily nested section</summary>

### Nested reactions

Reactions can be nested:

```TypeScript
    propActions = [linkFoundYourDream, [linkFoundYourPlace]];
```

This allows for a "suite" or "bundle" of reusable propAction reactions to be shared across multiple elements.

</details>

<details>
    <summary>DRY section</summary>

### Shareable Actions

The action:

```JavaScript
({domCache, clonedTemplate}) => {
    this.attachShadow({mode: 'open'});
    this.shadowRoot!.appendChild(clonedTemplate);
    this.clonedTemplate = undefined;
}
```

... is apt to be found in most every visual component that uses ShadowDOM, so long as all components use the names "domCache" and "clonedTemplate." In that case, we can share it by doing the following:

1.  Make sure this field is defined in the class:

```JavaScript
self = this;
```

2.  Now we can move the action out to a constant, and move it to some common import for reduced bandwidth when developing multiple custom elements:

```JavaScript
const linkClonedTemplate = ({domCache, clonedTemplate, self}) => {
    self.attachShadow({mode: 'open'});
    self.shadowRoot!.appendChild(clonedTemplate);
    self.clonedTemplate = undefined;
}
```
</details>



### XtalPattern

The library XtalPattern removes as much of the common boilerplate as possible (without using class inheritance or mix-ins).  It provides an interface.  Implementing the interface with Typescript will hopefully help the developer remember what needs to be done for a complete component.

Using XtalPattern, our component now looks like what's shown below (after expanding).  Remember, we are still in à la carte mode.

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
const refs = {buttonElements: '', countPart: ''};
const propActions = [
    xp.manageMainTemplate,
    ({domCache, count}: CounterRe) => [{
        [refs.countPart]:  count
    }],
    ({domCache, self}: CounterRe) => [{
        [refs.buttonElements]: [,{click:[self.changeCount, 'dataset.d', parseInt]}] as PESettings<CounterRe>,
    }],
    xp.createShadow
] as PropAction[];

export class CounterRe extends HTMLElement implements CounterDoProps, XtalPattern{
    static is = 'counter-re';
    propActions = propActions;
    
    reactor: IReactor = new RxSuppl(this, [
        {
            rhsType: Array,
            ctor: DOMKeyPE
        }
    ]);
    clonedTemplate: DocumentFragment | undefined; domCache: any;
    count!: number;
    connectedCallback(){
        mergeProps<CounterDoProps>(this, slicedPropDefs, {
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
    

}
const propDefMap: PropDefMap<CounterRe> = {
    ...xp.props,
    count: {
        type: Number
    }
};
const slicedPropDefs = getSlicedPropDefs(propDefMap);
letThereBeProps(CounterRe, slicedPropDefs, 'onPropChange');
define(CounterRe);
```
</details>

<details>
    <summary>Talking points</summary>

Note that we've moved some of the visual Rxn-Suppl's close to the template.  This is done in an effort to place highly related pieces close together.

Our class is whittling down now, so that the core business logic (count, changeCount) becomes easier to spot.

XtalPattern is continuing to impose more assumptions on names of properties -- in particular, mainTemplate, clonedTemplate, self, refs, domCache.
</details>

<details>
    <summary>Tentative Defaults</summary>

## Inversion of Props

The mergeProps function allows us to set initial properties in a methodical way -- giving precedence to externally set properties, then attributes, and default values as a backup.

But there are scenarios where we want to set the property externally, but we may not be able to do so right away.  We could just set the default value, and then allow the external property setting to take place when it's ready.  But in some cases, that could be quite expensive, especially when it comes to properties that affect rendering.

To prevent the default property from getting applied, instances of the component can be prevented from adopting the default property, by specifying an attribute that blocks the default setting.  The property can specify this with the byoAttrib setting:

```TypeScript
export const props = {
    clonedTemplate: transientCommon,
    domCache: common,
    mainTemplate: {
        ...common,
        byoAttrib: 'byo-m-t'
    },
    styleTemplate: {
        type: Object,
        dry: true,
        byoAttrib: 'byo-s-t'
    }
 } as PropDefMap<XtalPattern>;
```

Which is how we achieve:

### Inversion of View

So far, xtal-element has stuck to the standard tried-and-true approach of defining custom elements, which, internally, define the HTML structure of the component.

But since XtalPattern uses a public property "mainTemplate" to define that HTML structure, and which triggers the rendering process, this property could be **passed in from outside**, rather than following the standard practice of internally providing the view.  As long as the keys (parts / classes / attributes / id's) used to identify the critical UI elements are in sync, the code should work seamlessly with a potentially large number of UI variations.  Likewise with the optional "styleTemplate" property.

This could be achieved with old-fashioned inheritance, but there are some scenarios where inheritance might not be the desired approach.

If a XtalPattern-based web component's main template is not provided within, the web component will sit there, displaying the light children, until the consumer of each instance passes in a "mainTemplate" property of type HTMLTemplateElement.  "Lookless / white label components" taken to the extreme.

More pragmatically, perhaps, a web component built with xtal-element, using the XtalPattern, can have a default view, which can be overridden by the consumer.  This allows the same logic to be used, but with a user supplied variation of what is desired.

For this scenario, XtalPattern uses attribute name "byo-m-t" -- bring your own main template, to signify this.  This property blocks passing in the internally defined template view, as it is expecting the mainTemplate property to be passed in.

XtalPattern also supports "bring your own style template", "byo-s-t" corresponding to the optional styleTemplate property.

</details>

<details>
    <summary>Hydration, Part III</summary>

## syncProps

What about hydrating Shadow DOM, now that declarative ShadowDOM is weeks away from going live in a majority of browsers (fingers crossed)?

First, XtalPattern ensures that the shadow root isn't created unnecessarily.

Second, one or more properties can be defined with the specific task of ferrying down initial property values from the server.  If the server takes care of rendering the initial view, and that view is dependent on some properties, we want to pass down the properties in such a way that the client-side component is consistent with the rendered output, without rendering unnecessarily, since the server took care of that.  This technique is used with [if-diff](https://github.com/bahrus/if-diff#progressive-enhancement--server-side-rendering-ssr), for example. 

The prop setting which does this is called "syncProps."  Just thought you should know.

</details>

## Whatabouts

### What about loops?

Many component libraries prominently support some ability to render repeating content as part of the native syntax.  xtal-element likes the idea Polymer pioneered -- use web components to do this.  There are a number of high quality repeating web components, from Polymer, Vaadin, and others.

One looping web component confirmed to be compatible with xtal-element is [ib-id](https://github.com/bahrus/ib-id).  It builds on xtal-element, so another happy feature is the additional footprint from using ib-id is ~400b.  It differs from other repeating elements, in that it doesn't support internal markup within each iteration loop -- instead promoting the idea that that markup should be encapsulated inside a web component -- here is a place where we would really benefit from a ceremony-free way of rapidly creating web components.

### Conditional / Lazy Display?

Again, for HTML-centric environments (such as server-centric or HTML-module based web components) why not use web components for this?

Three libraries recommended as compatible with xtal-element are [if-diff](https://github.com/bahrus/if-diff), [iff-diff](https://github.com/bahrus/iff-diff) and [laissez-dom](https://github.com/bahrus/laissez-dom).

## Development Section Wrap-up

As we've seen, being able to choose exactly which utility functions to use in pursuit of developing a web component means a certain amount of ceremony is required for each component.  This ceremony seems worthwhile when developing long-serving web components meant to be used in a large variety of settings (highly reusable, compatible with all frameworks, capable of being loaded in different ways).

But what about web components that are only meant to be used within one application, or one component?  Why bother with supporting attributes if no one will use them, for example?

Suggested approaches to this scenario are provided below.  

</details>

## Low ceremony web components

Let's see how we can use xtal-element's utility functions, discussed in detail in the collapsed sections above, to generate web components as quickly as possible.

### c-c and carbon-copy

My favorite approach to this is using the [c-c or carbon-copy](https://github.com/bahrus/carbon-copy#c-c----codeless-web-components) web component "factory":

```html
<template id=hello-world>
    <div>Hello, {{place}}</div>
</template>
<c-c copy from="/hello-world" string-props='["place"]'></c-c>

<hello-world place="Mars"></hello-world>
```

*carbon-copy* uses the very utility functions we've been painstakingly documenting so far (in the collapsed sections), to do its thing.

Unfortunately, this way of defining custom elements doesn't make sense in our JS-centric world (sigh).

In such a setting, the X base class, discussed below, is, I think, tolerable in a JS-centric world, and will be much more appealing if/when standards show some HTML love.

### Low ceremony X base class

```JavaScript
const mainTemplate = html`
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
const refs = {buttonElements: '', spanElement: ''};
const propActions = [
  ({domCache, self}: CounterMi) => [
    {[refs.buttonElements]: [,{click:[self.changeCount, 'dataset.d', parseInt]}]}
  ],
  ({domCache, count}: CounterMi) => [
    {[refs.spanElement]:  count}
  ]
] as PropAction[];

export class CounterMi extends X{
    count = 0;

    changeCount(delta: number){
        this.count += delta;
    }
}

X.tend({
    name: 'counter-mi',
    class: CounterMi as {new(): X},
    mainTemplate,
    propActions,
    refs
});
```

<details>
    <summary>Talking points</summary>

1.  Note that the class CounterMi is fairly library neutral.  With the exception of extending class X, none of the logic within is library specific.
2.  For true library agnostic classes, use [mix-ins](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes#mix-ins).
</details>


<!--Missing features of low-ceremony Xtal components:
[TODO]
hydrating properties support, attributes.-->

<details>
    <summary>Custom property settings</summary>

In the low ceremony example above, note that we didn't have to define the properties supported by the web component.  X infers the properties based on the PropAction signatures.  This should be sufficient for rapid web component development.

But what if you are developing a more nuanced web component, and need to fine tune the properties?

You can specify the propDefs explicitly:

```JavaScript
X.tend({
    name: 'counter-mi',
    ...
    propDefs: {
        ...
    },
    ...
});
```

To specify not to use ShadowDOM:

```JavaScript
X.tend({
    name: 'counter-mi',
    ...
    noShadow: true,
    ...
});
```

## Rendering Flattened Views [TODO]

<details>
    <summary>The Xtal Fragment Pattern</summary>

When rendering lists of items, using built-in semantic elements, such as tables or dl's, it is often useful for a custom element to render its content via siblings (setting its own style.display to 'none' in order to not run afoul of allowed child restrictions (hopefully) as well as rendering costs).  The browser may or may not be flexible enough in some case, to accommodate element structures that deviate from the prescribed structure, but not [always](https://stackoverflow.com/questions/53083606/how-to-make-custom-table-in-custom-elementhttps://stackoverflow.com/questions/53083606/how-to-make-custom-table-in-custom-element)

So XtalElement, then supports three modes of rendering:

1.  No to ShadowDOM, but content is nested inside.
2.  Yes to ShadowDOM, but content is nested inside.
3.  No to ShadowDOM, but content is rendered as contiguous grouped siblings that the element manages (including associated lifecycle events / memory cleanup). [TODO]

This section is devoted to discussing the off-the-beaten-track 3rd option above.

**NB:** Be prepared for a bumpy ride when deploying a web component that uses this approach.  Use of this third pattern may result in encountering issues when mixed in with other rendering libraries that aren't privy to this artificial "nesting" of child components.

</details>

## Rendering Fluid Views [TODO]

