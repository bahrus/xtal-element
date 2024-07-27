
[![How big is this package in your project?](https://img.shields.io/bundlephobia/minzip/xtal-element?style=for-the-badge)](https://bundlephobia.com/result?p=xtal-element)
[![NPM version](https://badge.fury.io/js/xtal-element.png)](http://badge.fury.io/js/xtal-element)
<img src="http://img.badgesize.io/https://cdn.jsdelivr.net/npm/xtal-element?compression=gzip">
[![Playwright Tests](https://github.com/bahrus/xtal-element/actions/workflows/CI.yml/badge.svg?branch=baseline)](https://github.com/bahrus/xtal-element/actions/workflows/CI.yml)



<details>
<summary>The constitution of a xtal-element</summary>

Development of a xtal-element consists of checks and balances between these mental "branches" of development:

1.  The "Majestic Definitive Branch".   An mjs file that is used to build an html file.  Developers can skip this step, if they prefer to edit the html file directly.  Developing xtal-element elements via *.mjs works best in combination with the [be-importing](https://github.com/bahrus/be-importing) compiler, which for now is limited to providing tagged template literal support.  
2.  The "Concessional Branch":  CSS styling, imported via CSS Modules or via a style tag within the html file.  There are two strong reasons to keep the CSS in a separate file (but this is not a doctrinaire rule).  
    1.  Multiple components share the same CSS.
    2.  "Dependency injection":  with the help of the link preload tag (and/or, possibly, import maps), allow the consumer of the web component to define their own theme, with no penalty for the consumer from the original default css theme which the developer chose to forgo.
3.  "The "Ecmascript Branch".  The client-side Javascript that must ship and execute in the browser's main thread to achieve the desired functionality.  Minimal JS boilerplate to "tie the knot" as far as registering the custom element, and specialized methods made available to the custom element class, as a last resort.  If github autopilot is accurately guessing all your next moves when writing JS, maybe it's time to encapsulate that as a declarative web component or behavior/decorator.  With current standards, we are pushed quite hard to make this file serve as the entry point for our custom element.  The JS file can then import the other two files in parallel (especially if link rel=preload is used).  However, with the help of a few key behaviors / decorators built with xtal-element, it is possible to circumvent [the need for the boilerplate JS](https://github.com/bahrus/be-definitive).  Use of other xtal-element built components allows the JSON and CSS files to be replaced with alternative custom files for ultimate flexibility / customizability / extensibility, with no additional payload.  This is configured via optional (but highly encouraged) link rel=preload tags.


Additional files that are optional, but definitely helpful / expected for an xtal-element-based custom element:

1.  A TypeScript types file.  Note that using build-less, [ts-check](https://devblogs.microsoft.com/typescript/announcing-typescript-5-5/#the-jsdoc-import-tag) mjs files, rather than global warming inducing typescript building, is encouraged!
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

The preferred mechanism to incorporate custom JavaScript, though, is not to use the onload=eval, but rather to "use the platform" and to define a JavaScript class.  The JavaScript class must extend (at the "bottom" of the hierarchy) [trans-render/Mount.js](https://github.com/bahrus/trans-render/wiki/VI.--Mount%E2%80%90based-web-components), and be registered as a web component if using the declarative support of this package.

The nice thing is this allows us to reuse the same web component base with different UI definitions, something I've found to be quite useful, personally.

[TODO]: document

## Example 4b -- Support for external source

# Real world example

## Example 1 up-down-counter

[Streaming HTML definition](https://github.com/bahrus/up-down-counter/blob/baseline/root.html)

[How to reference it locally with no build step.](https://github.com/bahrus/up-down-counter/blob/baseline/demo/dev.html)

