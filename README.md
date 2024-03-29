
[![How big is this package in your project?](https://img.shields.io/bundlephobia/minzip/xtal-element?style=for-the-badge)](https://bundlephobia.com/result?p=xtal-element)
[![NPM version](https://badge.fury.io/js/xtal-element.png)](http://badge.fury.io/js/xtal-element)
<img src="http://img.badgesize.io/https://cdn.jsdelivr.net/npm/xtal-element?compression=gzip">
[![Playwright Tests](https://github.com/bahrus/xtal-element/actions/workflows/CI.yml/badge.svg?branch=baseline)](https://github.com/bahrus/xtal-element/actions/workflows/CI.yml)

<details>
    <summary>Preramble</summary>

When, in the Course of web development, it becomes necessary to migrate to a new way of building and connecting components together, and to dissolve the tight coupling which has heretofore made this far more difficult than what developers should be entitled to, a decent respect for the excellent, opinionated Web Component Libraries that already exist, impels a lengthy explanation of the Separation of Concern approach xtal-element assumes to solve this well, and why this requires the introduction of yet another web component helper library, and so we declaratively describe the Nature of this Separation.

We hold these truths to be self-evident, after bumbling around for months and months:

<details>
    <summary>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1.  All UI Libraries Are Created Equal</summary>

The great thing about web components is that little web components built with tagged template literals can connect with little web components built with Elm, and web components will be judged by the content they provide, rather than superficial internal technical library choices. 

For example, an interesting debate that has existed for a number of years has been between OOP vs functional programming.  Efforts to "embrace the duality paradox" like Scala and F# always appealed to me.  In the realm of UI development, this has been an interesting dichotomy to follow.  Traditionally, JavaScript was a unique (?) "function first" language, which seemingly [inspired some envy / second guessing](https://www.joelonsoftware.com/2006/08/01/can-your-programming-language-do-this/) from the [everything is a class class of developers](https://www.quora.com/Why-does-everything-have-to-be-in-a-class-in-Java?share=1).  The introduction of classes into JavaScript has been met with some healthy skepticism.  The "hooks" initiative adds an interesting twist to the debate, and might strike the right balance for some types of components.  Evidently, the result has been less boilerplate code, which can only be good.  Perhaps the learning curve is lower as well, and that's great.

xtal-element takes the view that classes are a great addition to the JavaScript language, even if they don't solve every issue perfectly.  Some points raised by the React team do hit home with me regarding classes.  

<details>
    <summary>My personal journey with classes</summary>

Speaking personally, I came from an academic (mathematical) background, and functions felt much more natural to me.  Yes, I saw the need for namespaced functions, and having the ability to hold data structures with nested sub-structures.  But the way people gushed about *combining these two things into one entity* simply left me scratching my head.  The examples I would read were c++ books that would start with Giraffes and Dogs, and then jump into describing how to create a Windows window, and I would get lost about 5 pages in.  Visual Basic (originally codenamed ["Thunder"](http://www.forestmoon.com/birthofvb/birthofvb.html), maybe because of its emphasis on making it easy to respond to events?), in contrast, simply required an animated gif to explain, and it didn't even use classes originally!   I simply didn't see the appeal of classes, until the day I joined an actual software company, and worked with problems centered around database tables, with customers, employees, transactions.  Finally, the lightbulb lit in my mind.  I can certainly see why a new developer would also question the need to learn the subtleties of classes just to wire a button to a textbox.  Add to that the subtleties of "this" and the syntax is a little clunkier (new class()).doFunction()...  )

Yes, I did think quite a bit about the question, and playing around a bit, before landing on the current approach that this library uses / encourages.

I think one factor that needs to be considered when weighing the pro's and con's between classes and functions for defining components, is another duality paradox:  the "à la carte vs. buffet duality paradox."

Are we:

1.  Creating, with tender loving care, a component meant to have a minimum footprint, while being highly reusable, leverageable in multiple frameworks / no frameworks, server-side-rendered / not-server-side-rendered, loaded synchronously / asynchronously, bundled / not bundled, ShadowDOM / noShadowDOM, etc?
2.  Engaging in RAD-style creation of a local component only to be used in a specific way by one application or one component?

xtal-element is a bit more biased towards the former, but strives not to sacrifice the second goal as much as possible.  Judge for yourself, I guess.

So xtal-element encourages use of classes in a way that might avoid some of the pitfalls, while benefitting from the really nice features of classes, namely:

1.  Support for easily tweaking one custom element with another (method overriding).
2.  Taking advantage of the nice way classes can help organize data and functionality together.
    
</details> <!-- Personal Journey -->

</details> <!-- All Ui Libraries Equal -->

<details>
    <summary>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2.  Looks aren't everything</summary>

The core functionality of xtal-element is not centered around rendering content.  There are numerous scenarios where we want to build a component and not impose any rendering library performance penalty.  They generally fall into one of these four scenarios and counting:

1.  "Web Components as a Service":  Providing a timer component or some other non visual functionality.
2.  Providing a wrapper around a third-party client-side library that does its own rendering.  Like a charting library. 
3.  Providing a wrapper around server-rendered content.
4.  "Web Components as an Organism".  Providing a viewModel from raw data that serves as a non-visual "brain" component that handles all the difficult JavaScript logic, and that is all.  Other non-visual components transmit updates from the 'brain" component to peripheral visual components, and dispatch updates back up to the "brain" component.  All contained within a large single web component (the body).  Kind of the same as 1, but with a little more context.

</details>

<details>
    <summary>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3.  The pursuit of happiness is achieved when Web Components can be opened directly as an HTML page.</summary>

Web components built with xtal-element provide an HTML output option that allows the web component to provide its own demo directly by opening the HTML file in a browser.  It can still be embedded in a web stream / page as a standard web component.  Demo'ing such a web component couldn't be easier.

</details> 

<details>
    <summary>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;4.  Content coming from the server is entitled to be displayed, 
    free from client-side JavaScript meddling, as long as it best represents what the user wants to view</summary>

This is a tricky one.  What is absolutely clear is we want to keep the number of renders low (and changes made during a render to be as minimal as possible).

As mentioned earlier, the core functionality of a xtal-element doesn't address rendering.  However, there are some core mixins xtal-element provides, that do provide rendering capabilities.

The functionality those mixins provide can be broken down into the following steps:

1.  If needed, create ShadowDOM.
2.  If needed, clone the main template.
3.  If needed, attach event handlers to the cloned template.  This is done via an optional user-defined "hydratingTransform".
4.  If needed, before appending the cloned template into the live ShadowDOM tree (or directly in the element if forgoing shadow DOM), perform the first "updateTransform" where the props are passed in.
5.  If needed, append the cloned template into the shadowDOM or element itself.
6.  Reactively (re)perform the updateTransform as props change.

Many of the "if needed"'s are there because xtal-element supports server-side rendering, so not all those steps are really needed in that case.

xtal-element is fully committed to providing support for server-side rendering.  It specifically targets SSR that is based on optionally weaving dynamic data into static html files via Cloudflare's HTMLRewrite API, but is also compatible with client-side rendering using DOM API's.  So this raises a number of scenarios an xtal element needs to consider.

Some of the scenarios listed below can happen in combination, some are mutually exclusive.  It would make for a complex Venn diagram:

1.  Minimal server-side rendering.  Server only creates an instance of the tag, and sets some attributes, and the light children.
2.  Limited Shadow DOM server-side rendering, limited to pasting in the Shadow DOM defined in the static html file, without any attempt to do any of the binding defined within, of which there are some beyond slot mapping.
3.  Limited Shadow DOM server-side rendering, but the Shadow DOM requires no dynamic adjustments.
4.  A full-blown server-side rendering solution of only one initial instance, complete with applying the binding instructions. 
5.  A full-blown server-side rendering solution of all instances of the component.
6.  The full state needed for rendering is provided as a combination of JSON-serialized attributes and light children.
7.  Less than the full state is defined within the geographical boundaries of the element.  Instead, some separate elements (sibling or parent) are used to integrate part of the state, including non-JSON serializable settings.

Only scenarios 3, 4 (first instance) and 5 do not require a first pass update render on the client-side.  We need a way for the server to indicate this clearly to the client side instance.

Scenario 7 makes things complicated, as it becomes difficult to know *when* to do the first update render.  The safe thing would be rerender each time pieces of the state are passed in.  But that isn't optimal.  This is the use-case that is central to the defer-hydration proposal (I think).

xtal-element makes a clear division between main template cloning,  hydrating rendering, which involves adding event handlers, pulling in templates, vs update handling, reacting to prop changes.

<table>
    <caption>Indications</caption>
    <thead>
        <tr>
            <th>Scenario</th>
            <th>Server-side attributes</th>
            <th>Actions performed</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>No server-side rendering, no planning-ahead defer-hydration hints</td>
            <td>None</td>
            <td>Do main template cloning, Do Init Render, Update Render</td>
        </tr>
        <tr>
            <td>Server-side rendering, copy-paste, no binding</td>
            <td>defer-hydration=['' if 1 external setter, number of external setters if > 1, no attribute if none]</td>
            <td>Only do Init Render, update transform after defer-hydration attribute removed.</td>
        </tr>
        <tr>
            <td>Server-side rendering, copy-paste, with binding</td>
            <td>defer-hydration=[Same as above], defer-rendering</td>
            <td>Only do Init Render after defer-hydration attribute removed, skip update transform but remove defer-rendering the first time.</td>
        </tr>
    </tbody>

</table>


</details> <!-- SSR -->

<details>
    <summary>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;5.  JSON and HTML Modules will land on Planet Earth someday.</summary>

xtal-element subscribes to the [rule of least power philosophy](https://www.w3.org/2001/tag/doc/leastPower.html).  It is designed as a natural segue into declarative custom elements.  As much logic as possible is made truly declarative with JSON.  It even encourages developers to apply a little extra ceremony to demonstrate commitment to true declarative syntax, separating settings that are JSON serializable from those that are not (such as function / class references).  While the developer can still use the easier to edit typescript / javascript when configuring web components, the xtal-element approach encourages us to utilize JSON imports, and gain from lower parsing times, and [HTML modules/imports](https://bugs.chromium.org/p/chromium/issues/detail?id=990978), w3c willing, which could, if 
w3c shows some HTML (and end user) love, [would](https://github.com/WICG/webcomponents/issues/863) allow us to render as content streams, and also benefit, perhaps from more low-risk / ui-driven development.

</details>



<details>
    <summary>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;6.  Just follow your nose.</summary>

  
xtal-element embraces the duality paradox between Functional and OOP by following a pattern we shall refer to as FROOP:  Functional reactive object-oriented preening.

Properties are entirely defined and configured via JSON-serializable configurations.  The properties are there on the custom element prototype, but they are created dynamically by the trans-render / xtal-element library from the configurations provided by the developer.

This configuration is extended by trans-render's/xtal-element's "FROOP Orchestrator" to provide a kind of "service bus" that can easily integrate lots of tiny, loosely coupled "action methods."  Action methods of a class (or mixin) are functions -- methods and/or property arrow functions, which impose one tiny restriction:  Such methods should expect that the first (and really only) parameter passed in will be an instance of the class (or custom element) it acts on.  In other words, the "inputs" of the method will be already set property changes.  The orchestrator allows the developer to pinpoint which action methods to call when properties change. *Ideally*, the signatures of such ideal action methods would all either look like:

```TypeScript
class MyCustomElement extends HTMLElement{
    myActionMethod({myProp1, myProp2}: this){
        ...
        return {
            myProp3,
            myProp4
        } as Partial<this>;
    }

    async myAsyncActionMethod({myProp1, myProp2}: this){
        ...
        return {
            myProp3,
            myProp4
        } as Partial<this>;
    }
}
```

together with 

```TypeScript

/**
 * Out of class Action Methods are shared across all instances, so better performance
 * *
 **/

const myOutOfBodyDeclarativeActionMethod = ({self, myProp1, myProp2}: MyCustomElement) => ({
    myProp3,
    myProp4
} as Partial<MyCustomElement>);

/**
 * Some heavy lifting out of body, non declarative action method (which is really a dynamic property of a class instance)
 * that could be dynamically imported and progressively enhance the custom element
 */
const myAsyncOutOfBodyActionMethod = async ({self, myProp1, myProp2}: MyCustomElement) => {
    //lots and lots of heavy code, combined with lots of dependencies...
    return {
        myProp3,
        myProp4
    } as Partial<MyCustomElement>

};

class MyCustomElement extends HTMLElement{
    self = this;
    myInternalActionMethod = ({self, myProp1, myProp2}: this) => {
        self.#myPrivateMethod(); //works!
        return {
            myProp3,
            myProp4
        } as Partial<MyCustomElement>;
    }
    myOutOfBodyDeclarativeActionMethod = myOutOfBodyDeclarativeActionMethod; 
    myAsyncOutOfBodyActionMethod = myAsyncOutOfBodyActionMethod; // this is a property, and could utilize the FROOP orchestrator to activate content progressively
}

```

What all these action methods have in common, is they don't directly have any side effects.  Ideally, they would generally all be self contained "nano-methods".  The FROOP orchestrator centralizes the pain and blame for causing side effects.

However, that's just the ideal.  As mentioned initially, the only hard rule for action methods is they should be able to take as the first argument an instance of the class (custom element). 

Further reading that is useful:

    https://javascriptweblog.wordpress.com/2015/11/02/of-classes-and-arrow-functions-a-cautionary-tale/
    https://www.charpeni.com/blog/arrow-functions-in-class-properties-might-not-be-as-great-as-we-think
    https://web.dev/javascript-this/

</details>

<details>
    <summary>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;7.  To withdraw into obscurity is the way of Heaven</summary>

xtal-element strives to impose as little custom syntax as possible, providing an avenue for extending / replacing the HTML vocabulary as immediately as possible.

This way the syntax can evolve, piece by piece, over time, based on usage, with no central authority in charge of it.

Almost all aspects of the rendering can be opt-in, with replacing syntax allowed, and significantly, because each aspect is downloaded within an overridable method only if specified, overriding the method and establishing alternative syntax has no penalty imposed by the original syntax, as it won't be downloaded.

The core rendering logic is also kept quite minimal. The core transform syntax xtal-element relies on, [DTR](https://github.com/bahrus/trans-render#declarative-trans-render-syntax-via-plugins),does its job well, but is limited to providing property value distributing, and adding event listeners, and common use case conditional logic.  But it stays true to our definition of declarative -- where no side effects can be introduced, and can execute anywhere html can execute, just like web components.

It stops there, and doesn't even provide support for loops, which most other UI libraries provide.

Instead, developers can pick and choose from a potentially infinite variety of custom attribute element decorators that provide such features, some specializing in certain scenarios, others focused on other use cases.

</details>


</details>

<details>
<summary>The constitution of a xtal-element</summary>

Development of a xtal-element consists of checks and balances between these mental "branches" of development:

1.  The "Majestic Definitive Branch".   An html file.  The developer can alternatively edit an mjs (or mts file with support for compile time checks), with the help of tagged template literals (though other syntaxes like the beautifully compact pug or the verbose JSX could certainly be supported, as long as the end result is the same html).  Developing xtal-element elements via *.mts works best in combination with the [may-it-be](https://github.com/bahrus/may-it-be) compiler, which for now is limited to providing tagged template literal support.  
2.  The "Concessional Branch":  CSS styling, imported via CSS Modules or via a style tag within the html file.  There are two strong reasons to keep the CSS in a separate file (but this is not a doctrinaire rule).  
    1.  Multiple components share the same CSS.
    2.  "Dependency injection":  with the help of the link preload tag (and/or, possibly, import maps), allow the consumer of the web component to define their own theme, with no penalty for the consumer from the original default css theme which the developer chose to forgo.
3.  "The "Ecmascript Branch".  The client-side Javascript that must ship and execute in the browser's main thread to achieve the desired functionality.  Minimal JS boilerplate to "tie the knot" as far as registering the custom element, and specialized methods made available to the custom element class, as a last resort.  If github autopilot is accurately guessing all your next moves when writing JS, maybe it's time to encapsulate that as a declarative web component or behavior/decorator.  With current standards, we are pushed quite hard to make this file serve as the entry point for our custom element.  The JS file can then import the other two files in parallel (especially if link rel=preload is used).  However, with the help of a few key behaviors / decorators built with xtal-element, it is possible to circumvent [the need for the boilerplate JS](https://github.com/bahrus/be-definitive).  Use of other xtal-element built components allows the JSON and CSS files to be replaced with alternative custom files for ultimate flexibility / customizability / extensibility, with no additional payload.  This is configured via optional (but highly encouraged) link rel=preload tags.


Additional files that are optional, but definitely helpful / expected for an xtal-element-based custom element:

1.  A TypeScript types file.
2.  A custom element manifest file (auto-generated.)

A potentially fourth branch of development involves JavaScript that influences the HTML markup of the declarative HTML web component -- either in an HTMLRewriter (supported by Cloudflare), and/or in a service worker, which, [w3c willing](https://discourse.wicg.io/t/proposal-support-cloudflares-htmlrewriter-api-in-workers/5721), could have a similar api, which would make [life good](https://dev.to/thepassle/service-worker-side-rendering-swsr-cb1). 

</details>

# Part I -- Non Visual Components

For non visual components, it makes sense that the definition for the component should be JS-first.

Let's take a look at the xtal-element way to define a "web component as a service" such as this [timer component](https://github.com/bahrus/time-ticker/blob/baseline/time-ticker.ts). 

```TypeScript
import {Actions, AllProps, PPE} from './types';
import {XE, ActionOnEventConfigs} from 'xtal-element/XE.js';

export class TimeTicker extends HTMLElement implements Actions{

    async start({duration, ticks, wait, controller}: this) {
        if(controller !== undefined){
            ticks = 0;
            controller.abort();
        }
        const newController = new AbortController();
        const {TimeEmitter} = await import('./TimeEmitter.js');
        const timeEmitter = new TimeEmitter(duration, newController.signal);
        return [
            {
                controller: newController,
                ticks: wait ? ticks : ticks + 1,
            }, 
            {
                incTicks: {on: 'value-changed', of: timeEmitter}
            }
        ] as PPE;
    }

    incTicks({ticks}: this){
        return {
            ticks: ticks + 1
        }
    }

    stop({controller}: this) {
        controller.abort();
        return {
            controller: undefined,
        };
    }


    rotateItem({idx, items}: this){
        return {
            value: {
                idx,
                item: (items && items.length > idx) ? items[idx] : undefined,
            }
        };
    }
}

export interface TimeTicker extends AllProps{}

const xe = new XE<AllProps, Actions>({
    config:{
        tagName: 'time-ticker',
        propDefaults: {
            ticks: 0,
            idx: -1,
            duration: 1_000,
            repeat: Infinity,
            enabled: true,
            disabled: false,
            loop: false,
            wait: true,
        },
        propInfo:{
            enabled:{
                dry: false,
                notify: {
                    negateTo: 'disabled',
                }
            },
            repeat: {
                dry: false,
            },
            value: {
                notify: {
                    dispatch: true,
                },
                parse: false,
            },
            items: {
                notify:{
                    lengthTo:'repeat'
                }
            },
            ticks: {
                notify: {
                    incTo: {
                        key: 'idx',
                        lt: 'repeat',
                        loop: 'loop',
                        notifyWhenMax: {
                            setTo: {
                                key: 'disabled',
                                val: true,
                            },
                        }
                    }
                }
            }
        },
        style: {
            display: 'none',
        },
        actions: {
            stop:{
                ifAllOf: ['disabled', 'controller']
            },
            start:{
                ifAllOf: ['duration'],
                ifNoneOf: ['disabled'],
            },
            rotateItem: {
                ifKeyIn: ['repeat', 'loop', 'idx'],
                ifNoneOf: ['disabled'],
            }
        }
    },
    superclass: TimeTicker,
});



```

Note that "XE" stands for "xtal-element".

## Talking Points

1.  The methods within the class are 100% all side-effect free.  It is the "FROOP reactive orchestrator", defined within the "actions" configuration, that routes method calls from prop changes, and causes side effects.
2.  "this" is used sparingly in the class (aside from the convenient, optional Typescript "type" in all the method destructuring).  In particular, if the "actions" that are orchestrated by the xtal-element configuration return properties, they are automatically assigned into the class instance (DOM element).  However, if you like "this", use it, if you prefer.  
3.  Approximately 70% of the lines of "code" in this class are JSON serializable (not counting a generic helper library which the web component is essentially wrapping).  In particular, everything inside the "config" section.  As browsers add support for JSON modules, we can cut the JS size by 2/3rds by moving all that JSON configuration to a JSON import, which is kinder to the browser's cpu.
4.  The ability to filter when methods are called using the "ifAllOf", "ifKeyIn", "ifNoneOf" means our actual code can avoid much of the clutter of checking if properties are undefined.
5.  The class where the logic goes is library neutral.
6.  Since all the non-library-neutral definition is ultimately represented as JSON / HTML, it is as easy as pie to convert the "proprietary" stuff to some other proprietary stuff.

## Counterpoints

<details>
    <summary>Is the code above really library neutral?</summary>

It seems to me that code like this:

```TypeScript
rotateItem({idx, items}: this){
    return {
        value: {
            idx,
            item: (items && items.length > idx) ? items[idx] : undefined,
        }
    };
}
```

... can be fairly effectively described as library neutral.  True, we are depending on something also modifying the value of the custom element.  But this code could still be useful in any framework, it will simply always require some companion code / engine that does something with it.  The code above captures the essence of the calculation, in other words.

This argument weakens somewhat when we start to use an additional feature the FROOP engine supports, all in the name of making each method easy to test and loosely coupled:

Action methods can return an array of objects - a tuple - and the FROOP orchestrator knows exactly what to do with it.  

The acronym for the tuple an action method can return is currently "P[A[D]]".  "P" stands for "props", so the first element of the array is interpreted, again, as things that should be shallow merged into the host via Object.assign.

So the code above is equivalent to the slightly more verbose:

```TypeScript
rotateItem({idx, items}: this){
    return [{
        value: {
            idx,
            item: (items && items.length > idx) ? items[idx] : undefined,
        }
    }];
}
```

...as far as the FROOP orchestrator is concerned.

The second element of the array, if there is one, the "A" element, stands for "add event listeners".  After spending years (literally) playing with custom elements / behaviors, a clear pattern emerges that often we need to add event handlers to things -- elements within or outside the shadow DOM, or in general any class instance that extends the EventTarget, however it is obtained.

We also saw an example of this two-element array in the timer example:

```TypeScript

async start({duration, ticks, wait, controller}: this) {
    ...
    return [
        {
            controller: newController,
            ticks: wait ? ticks : ticks + 1,
        }, 
        {
            incTicks: {on: 'value-changed', of: timeEmitter}
        }
    ] as PPE; //rename to PA?
}
```

What the second element of the array:

```JavaScript
{
    incTicks: {on: timeEmitter.emits, of: timeEmitter}
}
```

...is saying is:  "add event listener with type 'value-changed' to the timeEmitter class instance".  When the event is triggered, pass the event object to action method "incTicks", and (usually) shallow merge whatever that method returns into the host (recursively, including, if an array is passed back, adding new event handlers, etc).

The amount of code writing that doing this entails isn't huge, but it is kind of unpleasant boilerplate, full of parenthesis and arrows, not to mention cleanup code if needed. This is just a convenient shortcut.  But is utilizing something like this library neutral?

Migrating the code to some other "framework / library" would either mean unraveling the short cut and writing out the code explicitly in each instance or finding some mechanism in the new framework / library that can support the same shortcut(s).  Judge for yourself how deeply entangled utilizing this feature is, if this means [falling into](https://en.wikipedia.org/wiki/Vendor_lock-in) the ["vendor lock-in"](https://www.cloudflare.com/learning/cloud/what-is-vendor-lock-in/) trap that seems so prevalent in IT (*cough*react*cough*).



</details>

# Part II -- Counting

Let's move on now to what has become the *sine qua non* example for web components.  The [counter](https://webcomponents.dev/edit/W1J2NL0rQKSWDSwLScsm/src/index.js?p=stories).  Now we have a rudimentary UI, so we can see how xtal-element approaches this.  As always we show the optional TypeScript version.  The JS version isn't that different, just remove a little sugar here and there:

```TypeScript
import {TemplMgmt, TemplMgmtProps, TemplMgmtActions, beTransformed} from 'trans-render/lib/mixins/TemplMgmt.js';
import {CE} from 'trans-render/lib/CE.js';

export interface DTRCounterProps {
    count: number;
} 

const html = String.raw;
const css = String.raw;

const ce = new CE<DTRCounterProps & TemplMgmtProps, TemplMgmtActions>({
    config:  {
        tagName:'dtr-counter',
        actions:{
            ...beTransformed,
        },
        propDefaults:{
            count: 30,
            xform: {
                '% count': 0,
                "button": {
                    m: {
                        on: 'click',
                        inc: 'count',
                        byAmt: '.dataset.d',
                    },
                }
            } as XForm<DTRCounterProps, TemplMgmtActions>,
            mainTemplate: html `
                <button part=down data-d=-1>-</button>
                <span part=count></span>
                <button part=up data-d=1>+</button>`,
            styles: css `
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
`
        },
        
    },
    mixins: [TemplMgmt],
});
```

##  Spin Zone, Part II

1.  We have kept the binding syntax separate from the markup syntax, similar to CSS.  This is based on DTR syntax.  This means migrating to something else should be easier, as the library dependencies aren't all tangled up with the actual presentation structure.  Okay, maybe not such a big deal, but just saying. 
2.  What I would like to impress upon you is there isn't any code!  All but the second to last line is JSON serializable, making it truly declarative.
3.  So using this technique, we can envision a large number of web components that can already be made declarative, even without HTML Modules -- using JSON modules, where the JSON module contains a clob or two of HTML, and a clob of CSS.

Now before you run away, justifiably repelled by the notion of editing JSON, I hear you.  You and I are cut from the same cloth.

A light-touch "compiler" (or "transpiler"?) is provided by the [may-it-be](https://github.com/bahrus/may-it-be) package.  So we can edit *.mts files, and benefit from all the typing goodness TypeScript provides, or *.mjs files, and the may-it-be transpiler can output to a file for distribution, that formats the source file into the tightly constrained format that JSON requires.  (The may-it-be transpiler also supports another output option -- HTML with declarative ShadowDOM, discussed later.)  

Note that, unlike the previous example, we didn't use any libraries from this xtal-element package, in particular "XE".    The trans-render package, that contains the DTR library, already provides a bare-bones web component helper, CE (for Custom Element) that covers enough ground to provide a declarative, JS-free web component that meets the requirements for this component.  Keeping custom JS code to a minimum is a high priority goal of trans-render and xtal-element packages, so it would appear to be a fait accompli for this example at least.

# Part III - Web components from HTML streamed content

This package contains a web component, xtal-element, that allows us to manufacture other web components declaratively, conveniently, and without having to repeat ourselves by separately downloading a template.  Instead, the definition of the web component can be inferred from the live HTML stream, as part of the original payload of the web page, or, where it makes sense to lazy load, from an HTML stream delivered via fetch.  This has a number of benefits -- it is less complex for the developer to manage,  and it reduces the payload / time to interactivity.

The analogy is defining a variable, and assigning a result to the variable at the same time, when writing a program.

## Example 1a -- Pre-rendered live DOM that is reused 

```html
<div>
    <div>Hello, <span>world</span></div>
    <xtal-element aka=hello-world></xtal-element>
</div>

...

<hello-world></hello-world>
```

Renders:

```html
<div>
    <div>Hello, <span>world</span></div>
    <xtal-element aka=hello-world></xtal-element>
</div>
...
<hello-world>
    <div>Hello, <span>world</span></div>
</hello-world>
```

**NB:** Shadow DOM is bypassed in this instance.  It makes sense in this case not to use Shadow DOM for consistency between the original, defining element, and subsequent instances, for styling consistency.

In fact, the following may make more sense from a styling perspective, and also works:

## Example 1b -- Pre-rendered live DOM specifies the name of the web component:

```html
<hello-world>
    <div>Hello, <span>world</span></div>
    <xtal-element></xtal-element>
</hello-world>
<hello-world></hello-world>
```

Renders:

```html
<hello-world>
  <div>Hello, <span>world</span></div>
  <xtal-element></xtal-element>
</hello-world>
<hello-world>
  <div>Hello, <span>world</span></div>
</hello-world>
```

## Example 2a:  With inline binding

We can add implicit inline binding using microdata attributes:

```html
<hello-world place=Earth>
    <div itemscope>Hello, <span itemprop=place>world</span></div>
    <xtal-element infer-props></xtal-element>
</hello-world>
<hello-world place=Venus></hello-world>
<hello-world place=Mars></hello-world>
```


...renders:

```html
<hello-world>
    <div itemscope>Hello, <span itemprop=place>Earth</span></div>
    <xtal-element infer-props></xtal-element>
</hello-world>
<hello-world place=Venus>
    <div itemscope>Hello, <span itemprop=place>Venus</span></div>
</hello-world>
<hello-world place=Mars>
    <div itemscope>Hello, <span itemprop=place>Mars</span></div>
</hello-world>
```

So the first instance of the pattern displays without a single byte of Javascript being downloaded. 

Subsequent instances take less bandwidth to download, and generate quite quickly due to use of templates.  It does require the xtal-element web component library to be loaded once.

## Example 2b -- With dynamic properties, binding from a distance

```html
<div>
  <div>Hello, <span>world</span></div>
  <xtal-element 
    aka=hello-world 
    prop-defaults='{
        "place": "Venus"
    }' 
    xform='{
        "span": "place"
    }'
  ></xtal-element>
</div>
<hello-world place=Mars></hello-world>
<hello-world></hello-world>

```

... generates:

```html
<div>
    <div>Hello, <span>world</span></div>
    <xtal-element ...></xtal-element>
</div>
<hello-world place=Mars>
    <div>
        <div>Hello, <span>Mars</span></div>
    </div>
</hello-world>
<hello-world place=Mars>
    <div>
        <div>Hello, <span>Venus</span></div>
    </div>
</hello-world>
```

Again, using Shadow DOM is somewhat iffy, as styling is fundamentally different between the "defining" element and subsequent elements, thus Shadow DOM is not used by default.

To enable ShadowDOM, use the "shadowRootMode" setting:

## Example 2c -- with shadow DOM

```html
<div>
  <div>Hello, <span>world</span></div>
  <xtal-element 
    aka=hello-world 
    shadow-root-mode=open
    prop-defaults='{
        "place": "Venus"
    }' 
    xform='{
        "span": "place"
    }'
  ></xtal-element>
</div>
<hello-world place=Mars></hello-world>
```

Editing JSON-in-html can be rather error prone.  A [VS Code extension](https://marketplace.visualstudio.com/items?itemName=andersonbruceb.json-in-html) is available to help with that, and is compatible with web versions of VSCode.

And in practice, it is also quite ergonomic to edit these declarative web components in a *.mjs file that executes in node as the file changes, and compiles to an html file via the [may-it-be](https://github.com/bahrus/may-it-be) compiler.  This allows the attributes to be editable with JS-like syntax.  Typescript >4.6 supports compiling mts to mjs files, which then allows typing of the attributes.  Examples of this in practice are:

1.  [xtal-side-nav](https://github.com/bahrus/xtal-side-nav)
2.  [xtal-editor](https://github.com/bahrus/xtal-editor)
3.  [cotus](https://github.com/bahrus/cotus)
4.  [plus-minus](https://github.com/bahrus/plus-minus)
5.  [scratch-box](https://github.com/bahrus/scratch-box)

Anyway.

The "xform" setting uses [TR](https://github.com/bahrus/trans-render) syntax, similar to CSS, in order to bind the template "from a distance", but *xtal-element* eagerly awaits inline binding with Template Instantiation being built into the platform as well, so the two approaches can collaborate.


## Example 3a -- Pre-rendered web components that use streaming declarative Shadow DOM.

This syntax also works:

```html
<hello-world place=Earth>
  <template shadowrootmode=open>
      <div itemscope>Hello, <span itemprop=place>world</span></div>
        <style adopt>
            span {
                color: green;
            }
        </style>
        <xtal-element infer-props></xtal-element>
  </template>
</hello-world>
<hello-world place=Mars></hello-world>
<hello-world place=Venus></hello-world>
```

It requires declarative [ShadowDOM polyfill for Firefox](https://web.dev/declarative-shadow-dom/#detection-support), though Firefox nightly supports it now!

## Server-side rendering

A large swath of useful web components, for example web components that wrap some of the amazing [codepens](https://duckduckgo.com/?q=best+codepens+of&t=h_&ia=web) we see, don't (or shouldn't, anyway) require a single line of custom Javascript.  The slot mechanism supported by web components can go a long way towards weaving in dynamic content.

In that scenario, the CDN server of the (pre-built) static HTML file (or a local file inclusion, imported into the solution via npm) *is* the SSR solution, as long as the HTML file can either be 
1.  Embedded in the server stream for the entire page, or
2.  Client-side included, via a solution like Jquery's [load](https://api.jquery.com/load/) method, [k-fetch](https://github.com/bahrus/k-fetch), [include-fragment-element](https://github.com/github/include-fragment-element), [sl-include](https://shoelace.style/components/include), [templ-mount](https://github.com/bahrus/templ-mount), [xtal-fetch](https://github.com/bahrus/xtal-fetch), [html-includes](https://www.filamentgroup.com/lab/), [wc-include](https://www.npmjs.com/package/@vanillawc/wc-include), [ng-include](https://www.w3schools.com/angular/ng_ng-include.asp), [html-include-element](https://www.npmjs.com/package/html-include-element) or countless other ought-to-be-built-into-the-platform-already-but-isn't options (sigh).
3.  On the client-side include side, [be-importing](https://github.com/bahrus/be-importing) is specifically tailored for this scenario.

The good people of github, in particular, earn a definitive stamp of approval from xtal-element.  They are definitely onto something quite significant, with [their insightful comment](https://github.com/github/include-fragment-element#relation-to-server-side-includes):

>This declarative approach is very similar to SSI or ESI directives. In fact, an edge implementation could replace the markup before its actually delivered to the client.

```html
<include-fragment src="/github/include-fragment/commit-count" timeout="100">
  <p>Counting commits…</p>
</include-fragment>
```

>A proxy may attempt to fetch and replace the fragment if the request finishes before the timeout. Otherwise the tag is delivered to the client. This library only implements the client side aspect.

[Music to my ears!](https://youtu.be/rnM-ULNxDus?t=239)


The client-side approach is more conducive to fine-grained caching, while the server-side stream approach better for above-the-fold initial view metrics.

If going with the server-side route, there are certainly scenarios where weaving in dynamic content in the server is useful, beyond what can be done with slots, in order to provide a better initial view.

One solution being pursued for this functionality is the [xodus cloudflare helper classes project](https://github.com/bahrus/xodus)/[edge-of-tomorrow](https://github.com/bahrus/edge-of-tomorrow).  Eventually, [w3c willing](https://github.com/whatwg/dom/issues/1222).

Its goal is to apply the "transform(s)" specified above, but in the cloud (or service worker) for the initial render (or pre-render?).

## Example 4a -- Referencing non-JSON serializable entities.

```html
<xtal-element
    onload=doEval 
    aka=hello-world 
    prop-defaults="{
        place: 'Venus'
    }" 
    xform="{
        span: {
            d: ({place}) => `What a beautiful world you are, ${place}`
        }
    }"
></xtal-element>
```

To evaluate dynamic expressions with full access to the JavaScript runtime engine, set attribute onload=doEval, as shown above.

[TODO]: document

## Example 4b -- Support for external source

# Real world example

## Example 1 up-down-counter

[Streaming HTML definition](https://github.com/bahrus/up-down-counter/blob/baseline/root.html)

[How to reference it locally with no build step.](https://github.com/bahrus/up-down-counter/blob/baseline/demo/dev.html)



# Part V Dynamic Merging

The transform used in our counter above:

```JavaScript
xform: {
    '% count': 0,
    "button": {
        m: {
            on: 'click',
            inc: 'count',
            byAmt: '.dataset.d',
        },
    }
} as XForm<DTRCounterProps, TemplMgmtActions>,
```

are JSON serializable.  As such, they can be considered "static transforms" in the sense that they are "constant" transforms.  They don't change.  Yes, there's a dynamic binding in there (setting elements with part "count" to the value of "count" in the host object, that updates anytime the count changes).  And event handlers ("click").  But the transform objects themselves don't change.

 "Dynamic Mergings", in contrast, are fleeting "light transforms" that are emitted as part of the return object of an action method.  They are considerably less powerful than trans-rendering, as much of tran-rendering is concerned with "binding from a distance", as opposed to immediately updating the context.

Let's start with an example, that might be aptly titled "Clueless in SVG".

The package [xtal-fig](https://github.com/bahrus/xtal-fig) was done to see how xtal-elements could work with SVG.  They were done by an SVG (creator) newbie.  In particular, said newbie was unaware of the power of the css style: "width:inherit".  Nevertheless, it is an illustration of a scenario where static TR falls short:  Dynamically setting (deeply buried) style settings, that may require mathematical manipulation.  That is a prime candidate for use of dynamic transforms, as illustrated here:

```TypeScript

const mainTemplate = String.raw `
...
<svg xmlns="http://www.w3.org/2000/svg">
    <path part=para-fill 
        style="fill:#ccff00;stroke:none" />
    <path part=para-border 
        style="fill:none;stroke:#000000;stroke-linejoin:round;" />
    <g>
        <foreignObject part=inner>
            <slot></slot>
        </foreignObject>
    </g>
</svg>
`
export class XtalFigParallelogramCore extends HTMLElement implements ParaActions{
    setDimensions({width, height, strokeWidth, innerWidth, innerHeight, innerX, innerY, slant}: this): [PPara, EPara, DT] {
        const hOffset = width * Math.sin(Math.PI * slant / 180) + strokeWidth;
        return {
            "* path": {
                " d": `M ${hOffset},${strokeWidth} L ${width - strokeWidth},${strokeWidth} L ${width - hOffset},${height - strokeWidth} L ${strokeWidth},${height - strokeWidth} L ${hOffset},{strokeWidth}z`
            }
        }
    }
}
```

[TODO] go through special syntax in lhs in more detail.

If the transform contains "static" bindings to host properties, they will be applied once, but will **not** be automatically reapplied when the property changes, for dynamic transforms.  Nor will the bindings be applied to any elements that may be added into the (shadow) children after the method executes.

This is a "shortcut" for:

```JavaScript
export class XtalFigParallelogramCore extends HTMLElement implements ParaActions{
    setDimensions({width, height, strokeWidth, innerWidth, innerHeight, innerX, innerY, slant}: this){
        const hOffset = width * Math.sin(Math.PI * slant / 180) + strokeWidth;
        const root = this.clonedTemplate || this.shadowRoot; //preference is to apply this before added into the ShadowDOM
        root.querySelectorAll('path')forEach(el => el.setAttribute('d', 
            `M ${hOffset},${strokeWidth} L ${width - strokeWidth},${strokeWidth} L ${width - hOffset},${height - strokeWidth} L ${strokeWidth},${height - strokeWidth} L ${hOffset},${strokeWidth} z`
        ));
    }
}
```

Benefits

1.  With more complex scenarios, this "shortcut" can reduce boilerplate.
2.  No use of the dreaded "this".
3.  Is a little more library / UI "neutral".
4.  The method itself has no side effects and is easy to test. 
5.  Requires less "thought", perhaps.

Note also that if the developer never returns a three element array from an action method, the library that supports this feature is not loaded.



# Part IV Support for the non declarative script in the binding syntax for Static Transforms

Our counter example above showcased use of Declarative Trans Rendering (DTR), where there is no JavaScript, only JSON/HTML.

But some developers like a more hands-on approach, and don't want to be so constrained.  Or maybe early on in a web component development, before the component is mature, a developer wants to be able to play around with code before following a more disciplined approach.  Avoiding use of JavaScript in the template syntax will generally force the developer to define more computed properties (declaratively or with custom code).  xtal-element provides many "hooks" for setting up computed properties declaratively (meaning JSON-serializably).  But it does mean that the developer needs to name all these computed properties.  Naming can be emotionally draining.  Of course, there's nothing wrong with naming things prop1, prop2, etc, until the logic gels, and the best name becomes more apparent.  

Essentially, JavaScript in the template syntax is a way to provide "anonymous" custom properties, which certainly has its appeal.  DTR provides some flexibility to format what is displayed, via referencing things like toLocaleString.  However, that may not match what the developer needs.  So xtal-element embraces the duality paradox by providing an avenue for anonymous code execution during the rendering.

If you expand the section below, you will see a modified counter, where we define an "unsafeTransform", meaning full access to the JavaScript runtime engine is made available.  xtal-element makes no effort to glean what is happening in that transform, hence it won't automatically trigger the transform when the dependencies in the transform change.  So in this situation, the *developer* has to trigger the call to the "unsafeTransform", by incrementing the following property name:  unsafeTCount.

<details>
    <summary>Code sample with active script in the binding</summary>

```TypeScript
import {TemplMgmt, TemplMgmtProps, TemplMgmtActions, beTransformed} from 'trans-render/lib/mixins/TemplMgmt.js';
import {CE} from 'trans-render/lib/CE.js';
import { RenderContext } from 'trans-render/lib/types.js';

export interface DTRCounterProps {
    count: number;
} 


const ce = new CE<DTRCounterProps & TemplMgmtProps, TemplMgmtActions>({
    config:  {
        tagName:'dtr-counter',
        actions:{
            ...beTransformed,
        },
        propDefaults:{
            count: 30,
            hydratingTransform: {
                buttonElements: [{}, {click:{
                    prop:'count',
                    vft: 'dataset.d',
                    plusEq: true,
                    parseValAs: 'int',
                }}],
                span:[{}, {click:{
                    prop:'unsafeTCount',
                    vft: 'dataset.d',
                    plusEq: true,
                    parseValAs: 'int'
                }}]
            },
            transform: {
                countPart: 'count'
            },
            unsafeTransform: {
                span: ({target, host}: RenderContext) => {
                    console.log({target, host});
                }
            },
            mainTemplate: String.raw `<button part=down data-d=-1>-</button><span data-d=1 part=count></span><button part=up data-d=1>+</button>`,
            styles: String.raw `
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
`
        },
        
    },
    mixins: [TemplMgmt],
});
```
</details>

Note that if the developer only defines an unsafeTransform, and stays clear of the hydratingTransform and of the transform (for reactive updates), then the user will benefit in the sense that the supporting library that supports the declarative syntax isn't downloaded.

# Part IV The class-based answer to functional hooks? - homeIn's [Untested]

The thing I find most appealing about hooks (especially "signals") is the way it allows a single component to bind to multiple data sources -- Redux, Mobx, and/or its own state management system. Or, my favorite, state mechanisms built on stateful apparatuses of the platform -- like history/navigation state,  IndexedDB stores -- things that will be around for decades to come.  This binding is done  using one "template" syntax, in a (relatively) non-confusing way, where each binding is spelled out just before the template syntax begins, on an atomic level.

But with trans-rendering, we can have multiple, targeted transforms applied to the same base template, allowing for a much cleaner separation of concerns, perhaps. Most importantly each transform can provide its own "host", different from the main web component host.  Each of these "hosts" are linked to the main host via property that points to a class reference.

In the world of HTML-first solutions that xtal-element partakes in, there's a complimentary way to achieve something similar, and that's via inline attribute based element decorators / behaviors, like [be-observant](https://github.com/bahrus/be-observant).  But our focus here is on the less intrusive, stylesheet-like binding that trans-rendering supports.

We make the assumption that it makes sense that integration with such "stores" will be defined in separate classes, linked to via a property of the main class, via "class composition". Less atomic than hooks, perhaps, but perhaps it also entails a bit less busy work.

xtal-element allows each of these linked properties to have an associated transform that is performed on the main template.  The transform(s) can start being performed only when the dependency is loaded.

So, if the store has property count: we can bind to it thusly:

```JavaScript
class MyAllInclusiveWebComponent extends HTMLElement {
    async onReadyToCreateMobXStore({toDoListID}: self){
        const {ToDoMobXStore} = await import('./toDoMobXStore.js');
        const toDoList = new ToDoMobXStore(toDoListID);
        await toDoList.retrieve();
        return {
            toDoList // the Froop orchestrator sets property toDoList to this class instance
        }
    }
}

class ToDoMobStore extends EventTarget{ //allows the binding to be notified of updates
    #count;
    get count(){
        return this.#count;
    }
    set count(nv){
        this.#count = nv;
    }
    async retrieve(){
        ...
    }

    async addItem(){
        ...
        this.dispatchEvent(new CustomEvent('item-added'));
    }
}
define({
    config: {
        tagName: 'my-all-inclusive-web-component',
        propDefaults: {
            mainTemplate: '<div><span></span></div>',
            //each of these is optional
            //hydratingTransform: [],
            //transform: [] | {},
            //unsafeTransform: {},
            //transformPlugins:{}
            homeInOn: {
                toDoList: {
                    //each of these is optional
                    //hydratingTransform: [], 
                    transform: {
                        span: count //here's our binding!
                    },
                    //unsafeTransform: {},
                    updateOn: ['item-added'],
                    subscribe: true,
                },
                "reduxStore.subProp3.subSubProp4": {
                    //each of these is optional
                    //hydratingTransform: [],
                    //transform: [],
                    //unsafeTransform: {},
                    //updateOn: [],
                    //subscribe: false,
                }
            }
        },
        
    }
});

```

For each of these transforms, the referenced prop becomes the "host" (or model) of the transform, referenced in ctx.host.

If the prop points to a class instance which extends EventTarget, we can subscribe to events to know when to run the transform.  hydratingTransform is run once on property connecting for the first time.

In addition, if "subscribe" is set to true, the setters of the class will be subscribed to (which is a bit intrusive, and assumes getters/setters for all the properties), which may be autogenerated by a decorator, but this example is avoiding anything fancy for illustrative purposes.

# Part V  Documentation by Example

In the following sections, we point to working examples of web components built with xtal-element, to demonstrate features not yet (fully) documented

## Example I  xtal-fig

Take a look at [xtal-fig-diamond.ts](https://github.com/bahrus/xtal-fig/blob/baseline/xtal-fig-diamond.ts)

What this demonstrates:

1.  Ability to work with SVG markup
2.  Ability to pin weak ref references from the host to the host:

```JavaScript
config:{
    tagName: 'xtal-fig-diamond',
    propDefaults:{
        width:800, height:300, innerWidth:200, strokeWidth:5, innerHeight:100, innerX:300, innerY:100,
        hydratingTransform: {
            svgElement: true,
            pathElements: true,
            diamondBorderParts: true,
            innerPart: true,
        }
    },
    ...
}
```

Ability to reactively call declarative [out-of-class] arrow properties when the dependencies change, that don't get applied to the target host element (which is the default), but rather to the referenced property (via the target setting):

```JavaScript
const setOwnDimensions = ({width, height}: X) => ({
    style: {width:`${width}px`, height:`${height}px`}
});
const setSVGDimensions = ({width, height}: X) => [,,{width, height}];
const setPaths = ({width, strokeWidth, height}: X) => [,, {d: `M ${width / 2},${strokeWidth} L ${strokeWidth},${height / 2} L ${width / 2},${height-strokeWidth} L ${width - strokeWidth},${height / 2} L ${width / 2},${strokeWidth} z`,}];
const setDiamondBorder = ({strokeWidth}: X) => ({
    style: {strokeWidth: strokeWidth.toString()}
});
const setInnerDimensions = ({innerHeight, innerWidth, innerX, innerY}: X) => [,,{width: innerWidth, height: innerHeight, x: innerX, y: innerY}];
...

actions:{
    ...,
    setOwnDimensions:{
        ifKeyIn: ['width', 'height']
    },
    setSVGDimensions:{
        ifKeyIn: ['width', 'height'],
        ifAllOf: ['svgElement'],
        target: 'svgElement'
    },
    setPaths:{
        ifKeyIn: ['width', 'strokeWidth', 'height'],
        ifAllOf: ['pathElements'],
        target: 'pathElements'
    },
    setDiamondBorder:{
        ifKeyIn: ['strokeWidth'],
        ifAllOf: ['diamondBorderParts'],
        target: 'diamondBorderParts'
    },
    setInnerDimensions:{
        ifKeyIn: ['innerHeight', 'innerWidth', 'innerX', 'innerY'],
        ifAllOf: ['innerPart'],
        target: 'innerPart'
    }
}

```

## CE vs XE

So why did the first example we present require the use of xtal-element?  What value-add does xtal-element provide over it's only dependency, the trans-render package?

CE provides a bit less functionality -- in particular, it is sufficient for creating simple "introverted" web components that may require more custom code for computed properties. XE provides support for declaratively emitting events, and doing things like setting css pseudo state and form  support.  None of which was required in the counter example.

But an amazing benefit of dynamic imports is that they allow us to always just use the more powerful library (XE).  The extra services XE supports are only loaded if they are relevant.  It seems important for us to "prove" that it is possible to "scale up" from a basic web component ergonomic layer (CE), to a more powerful one (XE), in a seamless way, without incurring a penalty from unused features, and that has been accomplished.  

Bottom line, just use XE, unless you really need to shave a few bytes (containing the dynamic import statement).



## XENON

So if we use the may-it-be compiler to JSON-ify our nice declarative JS, we can import the JSON file, and automatically register the JSON file as a web component, via the XENON api:

```TypeScript
import {XENON} from 'xtal-element/src/XENON.js';
...

XENON.define(x => import('my-package/dtr-counter.json', {assert: {type: 'json'}}));
```

**NB**:  JSON imports abide by import maps!

So to reference a JSON based web component, two references are needed -- one-time reference for XENON, but once that is done, single references per JSON file / custom element.  Not too bad!

XENON stands for "**x**tal-**e**lement **n**ée of **object** **n**otation." 

[Polyfills exist](https://github.com/guybedford/es-module-shims#features) for JSON modules, for browsers that are still catching up.  It could [be a while](https://developer.mozilla.org/en-US/docs/Mozilla/Firefox/Experimental_features). 

When combined with trans-render plugins and [be-*](https://github.com/bahrus?tab=repositories&q=be-&type=&language=&sort=) decorators, both of which adhere to pure 100% declarative JSON syntax ultimately, a rather large variety of web components can be developed, JS (in the client browser) free! Of course we do need to download and execute these plugins, but once downloaded, the declarative syntax can scale rapidly to large, more complex applications, while the client-side JS remains tightly constrained in size.

## Hybrid Mode

Going back to our first example (the timer web component), we were not fully successful in our holy quest to vanquish all JavaScript.  Yes, once defined, all timers whose requirements are met by this component don't require any more client-side JavaScript (which is a benefit of any code reuse).  But the JavaScript the class contains doesn't seem amenable to "data-fying" in some way -- providing some generic functionality captured by JSON settings.  

But providing an easy way to move the remaining JSON serializable data to a separate file, which the browser can more easily digest, and safely replace with alternative settings, seems worthwhile.

For that purpose if CE (or XE) encounters a *function* rather than an object, for the "config" value, it will assume that calling the function will return a JSON import, so it will apply the function and replace the config value with the JSON data that is returned.

So here we present the timer component, take 2.  It is now split into two files:

The EcmaScript file:

```TypeScript
import {TimeTickerProps, TimeTickerActions} from './types';
import {XE} from 'xtal-element/src/XE.js';

export class TimeTicker extends HTMLElement implements TimeTickerActions{

    async start({duration, ticks, wait}: this) {
        const controller = new AbortController();
        const {animationInterval} = await import('./animationInterval.js');
        animationInterval(duration, controller.signal, time => {
            this.ticks++;
        });
        return {
            controller,
            ticks: wait ? ticks : ticks + 1,
        };
    }

    stop({controller}: this) {
        controller.abort();
        return {
            controller: undefined,
        };
    }

    rotateItems({items}: this){
        return {
            repeat: items.length,
        };
    }

    onTicks({idx, repeat, loop, items}: this){
        if(idx >= repeat - 1){
            if(loop){
                idx = -1;
            }else{
                return {
                    disabled: true,
                };
            }
        }
        idx++;
        return {
            idx,
            value: {
                idx,
                item: (items && items.length > idx) ? items[idx] : undefined,
            }
        };
    }
}

export interface TimeTicker extends TimeTickerProps{}

const xe = new XE<TimeTickerProps, TimeTickerActions>({
    config: () => import('./tt-config.json', {assert: {type: 'json'}}),
    superclass: TimeTicker,
});
```

and the MJS/MTS file used to generate the JSON file tt-config.json:

```TypeScript
import {DefineArgs} from 'xtal-element/src/types';
import {TimeTickerProps, TimeTickerActions} from './types';

const da: DefineArgs<TimeTickerProps, TimeTickerActions> = {
    config:{
        tagName: 'time-ticker',
        propDefaults: {
            ticks: 0,
            idx: -1,
            duration: 1_000,
            repeat: Infinity,
            enabled: true,
            disabled: false,
            loop: false,
            wait: false,
        },
        propInfo:{
            enabled:{
                dry: false,
                notify: {
                    toggleTo: 'disabled',
                }
            },
            repeat: {
                dry: false,
            },
            value: {
                notify: {
                    dispatch: true,
                },
                parse: false,
            },
        },
        style: {
            display: 'none',
        },
        actions: {
            stop:{
                ifAllOf: ['disabled', 'controller']
            },
            rotateItems:'items',
            start:{
                ifAllOf: ['duration'],
                ifNoneOf: ['disabled'],
            },
            onTicks: {
                ifAllOf: ['ticks'],
                ifKeyIn: ['repeat', 'loop'],
                ifNoneOf: ['disabled'],
            }
        }
    },
};

console.log(JSON.stringify(da.config));
```

**NB:**  It seems to be too soon to use JSON imports, without fallback mechanisms at least for components meant to work in multiple environments.  For example, esm.run doesn't support it yet.  However, [be-loaded/importJSON.js(https://github.com/bahrus/be-loaded/blob/baseline/importJSON.ts) may provide an interim solution.

