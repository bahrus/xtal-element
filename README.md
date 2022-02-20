
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

The core functionality of xtal-element is not centered around rendering content.  There are numerous scenarios where we want to build a component and not impose any rendering library performance penalty.  They generally fall into one of these three scenarios:

1.  Providing a timer component or some other non visual functionality.  "Component as a service".
2.  Providing a wrapper around a third-party client-side library that does its own rendering.  Like a charting library. 
3.  Providing a wrapper around server-rendered content.

</details>

<details>
    <summary>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3.  The pursuit of happiness is achieved when Web Components can be opened directly as an HTML page.</summary>

Web components built with xtal-element provide an HTML output option that allows the web component to provide its own demo directly by opening the HTML file in a browser.  It can still be embedded in a web stream / page as a standard web component.  Demo'ing such a web component couldn't be easier.

</details> 

<details>
    <summary>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;4.  Content coming from the server is entitled to be displayed, free from client-side JavaScript meddling, as long as it best represents what the user wants to view.</summary>

This is a tricky one.  What is absolutely clear is we want to keep the number of renders low (and changes made during a render to be as minimal as possible).

As mentioned earlier, the core functionality of a xtal-element doesn't address rendering.  However, there are some core mixins xtal-element provides, that do provide rendering capabilities.

The functionality those mixins provide can be broken down into the following steps:

1.  If needed, create ShadowDOM.
2.  If needed, clone the main template.
3.  If needed, attach event handlers to the cloned template.  This is done via an optional user-defined "initTransform".
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

xtal-element creates a clear division between main template cloning,  initial rendering, which involves adding event handlers, pulling in templates, vs update handling, reacting to prop changes.

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
    <summary>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;5.  JSON and HTML Modules will land on Planet Earth someday</summary>

xtal-element subscribes to the [rule of least power philosophy](https://www.w3.org/2001/tag/doc/leastPower.html).  It is designed as a natural segue into declarative custom elements.  As much logic as possible is made truly declarative with JSON.  It even encourages developers to apply a little extra ceremony to demonstrate commitment to true declarative syntax, separating settings that are JSON serializable from those that are not (such as function / class references).  While the developer can still use the easier to edit typescript / javascript when configuring web components, the xtal-element approach encourages us to utilize JSON imports, and gain from lower parsing times, and HTML modules/imports, w3c willing, which allows us to render as content streams, and also benefit, perhaps from more low-risk / ui-driven development.

</details>



<details>
    <summary>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;6.  This is FROOP</summary>

  
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

The core transform syntax xtal-element relies on, [DTR](https://github.com/bahrus/trans-render#declarative-trans-render-syntax-via-plugins), does its job well, but is limited to providing property value distributing, and adding event listeners.

It stops there, and doesn't even provide support for conditional or looping, which most other UI libraries provide.

Instead, developers can pick and choose from a potentially infinite variety of custom attribute element decorators that provide such features, some specializing in certain scenarios, others focused on other use cases.

</details>


</details>

<details>
<summary>The constitution of a xtal-element</summary>

Development of a xtal-element consists of checks and balances between these mental "branches" of development:

1.  The "Majestic Definitive Branch".   An mjs file that is only used by node.js (or deno) to build either an HTML file (with lots of snippets of JSON), or a JSON file, potentially with a blob of HTML, depending on the "center of gravity" of the component.  If it is a mostly visual component, ideally the output should be HTML (but you will face some headwinds from the browser currently).  If the focus is on something other than visual, JSON may be the better format, in which case the browser is your friend. The browser gets true, 100% declarative JSON configuration that can contain HTML strings, or HTML with snippets of JSON, if only... oh, never mind.  But the developer doesn't have to edit JSON.  The developer edits an mjs (or mts file -- support [coming soon hopefully](https://www.typescriptlang.org/docs/handbook/esm-node.html#:~:text=In%20turn%2C%20TypeScript%20supports%20two%20new%20source%20file,also%20supports%20two%20new%20declaration%20file%20extensions%3A.d.mts%20and.d.cts.)), and enjoys compile time checks, and edits html with the help of tagged template literals (though other syntaxes like pug or JSX could certainly be supported, as long as the end result is the same html/JSON).  Developing xtal-element elements works best in combination with the [may-it-be](https://github.com/bahrus/may-it-be) compiler, which for now is limited to providing tagged template literal support.  
2.  The "Concessional Branch":  CSS styling, imported via CSS Modules.  Especially if more than one component shares the same CSS.
3.  "The "Ecmascript Branch".  The client-side Javascript that must ship and execute in the browser to achieve the desired functionality.  Minimal JS boilerplate to "tie the knot" as far as registering the custom element, and specialized methods made available to the custom element class, as a last resort.  If github autopilot is accurately guessing all your next moves when writing JS, maybe it's time to encapsulate that as a declarative web component or behavior/decorator.  With current standards, we are pushed quite hard to make this file serve as the entry point for our custom element.  The JS file can then import the other two files in parallel (especially if link rel=preload is used).  However, with the help of a few key behaviors / decorators built with xtal-element, it is possible to circumvent [the need for the boilerplate JS](https://github.com/bahrus/be-definitive).  Use of other xtal-element built components allows the JSON and CSS files to be replaced with alternative custom files for ultimate flexibility / customizability / extensibility, with no additional payload.  This is configured via optional (but highly encouraged) link rel=preload tags.

Additional files that are optional, but definitely helpful / expected for an xtal-element-based custom element:

1.  A TypeScript types file.
2.  A custom element manifest file (auto-generated.)

</details>

# Part I -- Non Visual Components

For non visual components, it makes sense that the definition for the component should be JS-first.

Let's take a look at the xtal-element way to define a "component as a service" such as this [timer component](https://github.com/bahrus/time-ticker/blob/baseline/time-ticker.ts). 

```TypeScript
import {TimeTickerProps, TimeTickerActions} from './types';
import {XE} from 'xtal-element/src/XE.js';

export class TimeTicker extends HTMLElement implements TimeTickerActions{

    async start({duration, ticks, wait}: this) {
        const controller = new AbortController();
        const {animationInterval} = await import('./animationInterval.js');
        animationInterval(duration, controller.signal, time => {
            this.ticks++;
            this.wait
        });
        return {
            controller,
            ticks: wait ? ticks : ticks + 1,
        }
    }

    stop({controller}: this) {
        controller.abort();
        return {
            controller: undefined,
        }
    }

    rotateItems({items}: this){
        return {
            repeat: items.length,
        }
    }

    onTicks({idx, repeat, loop, items}: this){
        if(idx >= repeat - 1){
            if(loop){
                idx = -1;
            }else{
                return {
                    disabled: true,
                }
            }
        }
        idx++;
        return {
            idx,
            value: {
                idx,
                item: (items && items.length > idx) ? items[idx] : undefined,
            }
        }
    }
}

export interface TimeTicker extends TimeTickerProps{}

const xe = new XE<TimeTickerProps, TimeTickerActions>({
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
    superclass: TimeTicker,
});
```

Note that "XE" stands for "xtal-element".

## Talking Points

1.  The methods within the class are virtually all side-effect free.  It is the "reactive orchestrator", defined within the "actions" configuration, that routes method calls from prop changes, and causes side effects.  For example, rotateItems: 'items' means "when property 'items' is truthy, call rotateItems(this)".
2.  "this" is used sparingly in the class (aside from the convenient, optional Typescript "type" in all the method destructuring).  In particular, if the "actions" that are orchestrated by the xtal-element configuration return properties, they are automatically assigned into the class instance (DOM element).  However, if you like "this", use it, if you prefer.  
3.  Approximately 50% of the lines of "code" in this class are JSON serializable.  In particular, everything inside the "config" section.  As browsers add support for JSON modules, we can cut the JS size in half by moving all that JSON configuration to a JSON import, which is kinder to the browser's cpu.
4.  The ability to filter when methods are called using the "ifAllOf", "ifKeyIn", "ifNoneOf" means our actual code can avoid much of the clutter of checking if properties are undefined.
5.  The class where the logic goes is library neutral.

# Part II -- Counting

Let's move on now to what has become the *sine qua non* example for web components.  The [counter](https://webcomponents.dev/edit/W1J2NL0rQKSWDSwLScsm/src/index.js?p=stories).  Now we have a rudimentary UI, so we can see how xtal-element approaches this.  As always we show the optional TypeScript version.  The JS version isn't that different, just remove a little sugar here and there:

```TypeScript
import {TemplMgmt, TemplMgmtProps, TemplMgmtActions, beTransformed} from 'trans-render/lib/mixins/TemplMgmt.js';
import {CE} from 'trans-render/lib/CE.js';

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
            transform: [
                {
                    buttonElements: [{}, {click:{prop:'count', plusEq: true, vft: 'dataset.d',  parseValAs: 'int'}}]
                },
                {
                    countParts: 'count'
                }
            ],
            mainTemplate: String.raw `<button part=down data-d=-1>-</button><span part=count></span><button part=up data-d=1>+</button>`,
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

##  Spin Zone, Part II

1.  We have kept the binding syntax separate from the markup syntax, similar to CSS.  This is based on DTR syntax.  This means migrating to something else should be easier, as the library dependencies aren't all tangled up with the actual presentation structure.  Okay, maybe not such a big deal, but just saying. 
2.  What I would like to impress upon you is there isn't any code!  All but the second to last line is JSON serializable, making it truly declarative.
3.  So using this technique, we can envision a large number of web components that can already be made declarative, even without HTML Modules -- using JSON modules, where the JSON module contains a clob of HTML, and a clob of CSS.

Now before you run away, justifiably repelled by the notion of editing JSON, I hear you.  You and I are cut from the same cloth.

A light-touch "compiler" (or "transpiler"?) is provided by the [may-it-be](https://github.com/bahrus/may-it-be) package.  So we can edit *.mts files, and benefit from all the typing goodness TypeScript provides, or *.mjs files, and the may-it-be transpiler can output to a file for distribution, that formats the source file into the tightly constrained format that JSON requires.  (The may-it-be transpiler also supports another output option -- HTML with declarative ShadowDOM, discussed later.)  

Note that, unlike the previous example, we didn't use any libraries from this xtal-element package, in particular "XE".    The trans-render package, that contains the DTR library, already provides a bare-bones web component helper, CE (for Custom Element) that covers enough ground to provide a declarative, JS-free web component that meets the requirements for this component.  Keeping custom JS code to a minimum is a high priority goal of trans-render and xtal-element packages, so it would appear to be a fait accompli for this example at least.

## CE vs XE

So why did the first example we present require the use of xtal-element?  What value-add does xtal-element provide?

In this case, it provides considerably more nuance when it comes to the "FROOP" orchestrator, and to declarative property creation.  XE supports declaratively indicating which properties should dispatch events and having one property toggle to other properties.  None of which was required in the counter example.

As for the "FROOP Action Orchestrator"™, XE supports more logical checks.  CE only supports "ifAllOf" and "ifKeyIn", whereas XE also supports "ifNoneOf", "ifEquals", "ifOneOf".

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

Going back to our first example (the timer web component), we were not fully successful in our holy quest to vanquish all JavaScript.  Yes, once defined, all timers whose requirements are met by this component don't require any more client-side JavaScript (which is the whole idea behind xenia-based web components).  But the JavaScript the class contains doesn't seem amenable to "data-fying" in some way -- providing some generic functionality captured by JSON settings.  

But providing an easy way to move the remaining JSON serializable data to a separate file, which the browser can more easily digest, seems worthwhile.

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
            this.wait
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