
[![How big is this package in your project?](https://img.shields.io/bundlephobia/minzip/xtal-element?style=for-the-badge)](https://bundlephobia.com/result?p=xtal-element)
[![NPM version](https://badge.fury.io/js/xtal-element.png)](http://badge.fury.io/js/xtal-element)
<img src="http://img.badgesize.io/https://cdn.jsdelivr.net/npm/xtal-element?compression=gzip">
[![Playwright Tests](https://github.com/bahrus/xtal-element/actions/workflows/CI.yml/badge.svg?branch=baseline)](https://github.com/bahrus/xtal-element/actions/workflows/CI.yml)



<details>
<summary>The constitution of a xtal-element</summary>

Development of a xtal-element consists of checks and balances between these mental "branches" of development:

1.  The "Majestic Definitive Branch".   An html file.  The developer can alternatively edit an mjs (or mts file with support for compile time checks), with the help of tagged template literals (though other syntaxes like the beautifully compact pug or the verbose JSX could certainly be supported, as long as the end result is the same html).  Developing xtal-element elements via *.mts works best in combination with the [be-importing](https://github.com/bahrus/be-importing) compiler, which for now is limited to providing tagged template literal support.  
2.  The "Concessional Branch":  CSS styling, imported via CSS Modules or via a style tag within the html file.  There are two strong reasons to keep the CSS in a separate file (but this is not a doctrinaire rule).  
    1.  Multiple components share the same CSS.
    2.  "Dependency injection":  with the help of the link preload tag (and/or, possibly, import maps), allow the consumer of the web component to define their own theme, with no penalty for the consumer from the original default css theme which the developer chose to forgo.
3.  "The "Ecmascript Branch".  The client-side Javascript that must ship and execute in the browser's main thread to achieve the desired functionality.  Minimal JS boilerplate to "tie the knot" as far as registering the custom element, and specialized methods made available to the custom element class, as a last resort.  If github autopilot is accurately guessing all your next moves when writing JS, maybe it's time to encapsulate that as a declarative web component or behavior/decorator.  With current standards, we are pushed quite hard to make this file serve as the entry point for our custom element.  The JS file can then import the other two files in parallel (especially if link rel=preload is used).  However, with the help of a few key behaviors / decorators built with xtal-element, it is possible to circumvent [the need for the boilerplate JS](https://github.com/bahrus/be-definitive).  Use of other xtal-element built components allows the JSON and CSS files to be replaced with alternative custom files for ultimate flexibility / customizability / extensibility, with no additional payload.  This is configured via optional (but highly encouraged) link rel=preload tags.


Additional files that are optional, but definitely helpful / expected for an xtal-element-based custom element:

1.  A TypeScript types file.
2.  A custom element manifest file (auto-generated.)

A potentially fourth branch of development involves JavaScript that influences the HTML markup of the declarative HTML web component -- either in an HTMLRewriter (supported by Cloudflare), and/or in a service worker, which, [w3c willing](https://discourse.wicg.io/t/proposal-support-cloudflares-htmlrewriter-api-in-workers/5721), could have a similar api, which would make [life good](https://dev.to/thepassle/service-worker-side-rendering-swsr-cb1). 

</details>



# Web components from streamed  HTML content

*xtal-element* is a web component that allows us to manufacture other web components declaratively, conveniently, and without having to repeat ourselves by separately downloading a template.  Instead, the definition of the web component can be inferred from the live HTML stream, as part of the original payload of the web page, or, where it makes sense to lazy load, from an HTML stream delivered via fetch.  This has a number of benefits -- it is less complex for the developer to manage,  and it reduces the payload / time to interactivity.

The analogy is defining a variable, and assigning a value to the variable at the same time, when writing a program.

# Part I - no ShadowDOM custom elements

## Pre-rendered live DOM that is reused, with manual CSR attribute

```html
<div>
    <div>Hello, <span>world</span></div>
    <xtal-element aka=hello-world></xtal-element>
</div>

...

<hello-world csr></hello-world>
```

Here, *xtal-element* turns the content of the parent element into a web component.  So the *hello-world* tag would render as follows:


```html
<div>
    <div>Hello, <span>world</span></div>
    <xtal-element aka=hello-world></xtal-element>
</div>
...
<hello-world csr>
    <div>Hello, <span>world</span></div>
</hello-world>
```

> [!NOTE]
> Shadow DOM is bypassed in this instance.  It makes sense in this case not to use Shadow DOM for consistency between the original, defining element, and subsequent instances, for styling consistency.

> [!NOTE]
> It is best to place the xtal-element as the last child of the parent element, to support streaming most effectively.

In fact, the following may make more sense from a styling perspective, and also works:

## Example 1b -- Pre-rendered live DOM specifies the name of the web component:

```html
<hello-world>
    <div>Hello, <span>world</span></div>
    <xtal-element></xtal-element>
</hello-world>
<hello-world csr></hello-world>
```

Renders:

```html
<hello-world>
  <div>Hello, <span>world</span></div>
  <xtal-element></xtal-element>
</hello-world>
<hello-world csr>
  <div>Hello, <span>world</span></div>
</hello-world>
```

> [!NOTE]
> Why is the csr attribute necessary?  csr stands for "client-side-rendering" for the initial render.  Isn't it obvious we want to client side render if we are creating a web component?
> It is only necessary for web components that don't use declarative shadow DOM and don't use server-side-generated rendering, or server-side-generated rendering, or click-clackity keyboard typed rendering for the initial view.  Here's the thinking:
> 1. We don't want to do any unnecessary rendering.  So some sort of "message" protocol is required to reduce unnecessary rendering. 
> 2. The presence of declarative shadow DOM markup sends a strong signal that server side rendering was used.  Why go through the trouble of adding the template element if not?
> 3. In the absence of declarative shadow DOM clues, what can we use if ShadowDOM is not used?  I was tempted to say "if children are found assume server side rendering" but then there's this [masterclass in Hamlet-style indecision](https://github.com/WICG/webcomponents/issues/809).  So in the absence of mercy from the platform (a recurring pattern it seems) we are opting to err on the side of encouraging server-side rendering.
> 4. I want to be clear, though, that it isn't obvious in my mind if server-side rendering will always win out over csr for the second, and subsequent instances of a web component.  Yes, as far as the first instance it will be better performing. However, it's been a while since I've measured this, but I've seen instances where template cloning actually surpasses server-side rendering in some instances (without the help of [service workers](https://github.com/whatwg/dom/issues/1222), at least). So "do your own research", basically.
> 5.  Next, we will see an option to configure the web component so that the "default" assumption is reversed, so that "no-csr" is needed to block the (unnecessary?) initial render. 

## The assume-csr option

To address the concern above, add the following attribute to indicate that subsequent instances should apply client side rendering to the initial rendering:

```html
<div>
    <div>Hello, <span>world</span></div>
    <xtal-element aka=hello-world assume-csr></xtal-element>
</div>

<hello-world></hello-world>
```

## With inline, WHATWG-approved binding

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

## With "binding from a distance"

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

## With "binding from a distance" and with shadow DOM

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

1.  [up-down-counter](https://github.com/bahrus/up-down-counter)
2.  [xtal-side-nav](https://github.com/bahrus/xtal-side-nav)
3.  [xtal-editor](https://github.com/bahrus/xtal-editor)
4.  [cotus](https://github.com/bahrus/cotus)
5.  [plus-minus](https://github.com/bahrus/plus-minus)
6.  [scratch-box](https://github.com/bahrus/scratch-box)

Anyway.

The "binding from a distance" refers to the xform property (which stands for "transform").

The "xform" setting uses [Mount-observing transforms, or trans-rendering](https://github.com/bahrus/trans-render/wiki/V.--Mount%E2%80%90observing-transforms) syntax, similar to CSS, in order to bind the template "from a distance", but *xtal-element* eagerly awaits inline binding with Template Instantiation being built into the platform as well, so the two approaches can collaborate.


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

All the browsers support this now!

## Server-side rendering

A large swath of useful web components, for example web components that wrap some of the amazing [codepens](https://duckduckgo.com/?q=best+codepens+of&t=h_&ia=web) we see, don't (or shouldn't, anyway) require a single line of custom Javascript.  The slot mechanism supported by web components can go a long way towards weaving in dynamic content.

In that scenario, the CDN server of the (pre-built) static HTML file (or a local file inclusion, imported into the solution via npm) *is* the SSR solution, as long as the HTML file can either be 
1.  Embedded in the server stream for the entire page, or
2.  Client-side included, via a solution like Jquery's [load](https://api.jquery.com/load/) method, [k-fetch](https://github.com/bahrus/k-fetch), [include-fragment-element](https://github.com/github/include-fragment-element), [sl-include](https://shoelace.style/components/include), [templ-mount](https://github.com/bahrus/templ-mount), [xtal-fetch](https://github.com/bahrus/xtal-fetch), [html-includes](https://www.filamentgroup.com/lab/), [wc-include](https://www.npmjs.com/package/@vanillawc/wc-include), [ng-include](https://www.w3schools.com/angular/ng_ng-include.asp), [html-include-element](https://www.npmjs.com/package/html-include-element) or countless other ought-to-be-built-into-the-platform-already-but-isn't options (sigh).
3.  On the client-side include side, [be-importing](https://github.com/bahrus/be-importing) is specifically tailored for this scenario.

The good people of github, in particular, earn a definitive stamp of approval from xtal-element.  They are definitely onto something quite significant, with [their insightful comment](https://github.com/github/include-fragment-element#relation-to-server-side-includes):

>This declarative approach is very similar to SSI or ESI directives. In fact, an edge implementation could replace the markup before it's actually delivered to the client.

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

## The Ecmascript branch

The preferred mechanism to incorporate custom JavaScript, though, is not to use the onload=eval, but rather to "use the platform" and to define a JavaScript class.  The JavaScript class must extend (at the "bottom" of the hierarchy) [trans-render/Mount.js](https://github.com/bahrus/trans-render/wiki/VI.--Mount%E2%80%90based-web-components);

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

