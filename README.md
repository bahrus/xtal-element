
<details>
    <summary>Preramble</summary>

When, in the Course of web development, it becomes necessary to migrate to a new way of building and connecting components together, and to dissolve the tight coupling which has heretofore made this far more difficult than what developers should be entitled to, a decent respect for the excellent, opinionated Web Component Libraries that already exist, impels a lengthy explanation of the Separation of Concern approach xtal-element assumes to solve this well, and why this requires the introduction of yet another web component helper library, and so we declaratively describe the Nature of this Separation.

We hold these truths to be self-evident, after bumbling around for months and months:

<details>
    <summary>1.  All UI Libraries Are Created Equal</summary>

The great thing about web components is that little web components built with tagged template literals can connect with little web components built with Elm, and web components will be judged by the content they provide, rather than superficial internal technical library choices. 

For example, an interesting debate that has existed for a number of years has been between OOP vs functional programming.  Efforts to "embrace the duality paradox" like Scala and F# always appealed to me.  In the realm of UI development, this has been an interesting dichotomy to follow.  Traditionally, JavaScript was a unique (?) "function first" language, which seemingly [inspired some envy / second guessing](https://www.joelonsoftware.com/2006/08/01/can-your-programming-language-do-this/) from the [everything is a class class of developers](https://www.quora.com/Why-does-everything-have-to-be-in-a-class-in-Java?share=1).  The introduction of classes into JavaScript has been met with some healthy skepticism.  The "hooks" initiative adds an interesting twist to the debate, and might strike the right balance for some types of components.  Evidently, the result has been less boilerplate code, which can only be good.  Perhaps the learning curve is lower as well, and that's great.

xtal-element takes the view that classes are a great addition to the JavaScript language, even if they don't solve every issue perfectly.  Some points raised by the React team do hit home with me regarding classes.  

<details>
    <summary>My personal journey with classes</summary>

Speaking personally, I came from an academic (mathematical) background, and functions felt much more natural to me.  Yes, I saw the need for namespaced functions, and having the ability to hold data structures with nested sub-structures.  But the way people gushed about *combining these two things into one entity* simply left me scratching my head.  The examples I would read were c++ books that would start with Giraffes and Dogs, and then jump into describing how to create a Windows window, and I would get lost about 5 pages in.  Visual Basic (originally codenamed ["Thunder"](http://www.forestmoon.com/birthofvb/birthofvb.html), maybe because of its emphasis on making it easy to respond to events?), in contrast, simply required an animated gif to explain, and it didn't even use classes originally!   I simply didn't see the appeal of classes, until the day I joined an actual software company, and worked with problems centered around database tables, with customers, employees, transactions.  Finally, the lightbulb lit in my mind.  I can certainly see why a new developer would also question the need to learn the subtleties of classes just to wire a button to a textbox.  Add to that the subtleties of "this" and the syntax is a little clunkier (new class()).doFunction()...  )

Yes, I did think quite a bit about the question, and playing around a bit, before landing on the current approach that this library uses / encourages.

I think one factor that needs to be considered when weighing the pro's and con's between classes and functions for defining components, is another duality paradox:  the "à la carte vs. buffet duality paradox."

Are we:

1.  Creating, with tender loving care, a component meant to have a minimum footprint, while being highly reusable, leverageable in multiple frameworks / no frameworks, loading synchronously / asynchronously, bundled / not bundled, etc?
2.  Engaging in RAD-style creation of a local component only to be used in a specific way by one application or one component?

xtal-element is a bit more biased towards the former, but strives not to sacrifice the second goal as much as possible.  Judge for yourself, I guess.

So xtal-element encourages use of classes in a way that might avoid some of the pitfalls, while benefitting from the really nice features of classes, namely:

1.  Support for easily tweaking one custom element with another (method overriding).
2.  Taking advantage of the nice way classes can help organize data and functionality together.
    
</details> <!-- Personal Journey -->

</details> <!-- All Ui Libraries Equal -->

<details>
    <summary>2.  Content coming from the server is entitled to be displayed, free from client-side JavaScript meddling, as long as it best represents what the user wants to view.</summary>

Attribute defer-hydration is supported.
</details>

<details>
    <summary>3.  JSON and HTML Modules will land on Planet Earth someday</summary>

xtal-element subscribes to the [rule of least power philosophy](https://www.w3.org/2001/tag/doc/leastPower.html).  It is designed as a natural segue into declarative custom elements.  As much logic as possible is made truly declarative with JSON.  It even encourages developers to apply a little extra ceremony to demonstrate commitment to true declarative syntax, separating settings that are JSON serializable from those that are not (such as function / class references).  While the developer can still use the easier to edit typescript / javascript when configuring web components, the xtal-element encourages us to utilize JSON imports, and gain from lower parsing times, and perhaps more low-risk / ui-driven development.

</details>

<details>
    <summary>4.  This is FROOP</summary>

  
xtal-element embraces the duality paradox between Functional and OOP by following a pattern we shall refer to as FROOP:  Functional reactive object-oriented preening.

Properties are entirely defined and configured via JSON-serializable configurations.  The properties are there on the custom element prototype, but they are created dynamically by the trans-render / xtal-element library from the configurations provided by the developer.

Should decorators ever reach stage 3, they will also be supported.

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
    <summary>5.  Looks aren't everything</summary>

The core functionality of xtal-element is not centered around rendering content.  There are numerous scenarios where we want to build a component and not impose any rendering library performance penalty.  They generally fall into one of these three scenarios:

1.  Providing a timer component or some other non visual functionality.  "Component as a service".
2.  Providing a wrapper around a third-party client-side library that does its own rendering.  Like a charting library. 
3.  Providing a wrapper around server-rendered content.

</details>

</details>

<details>
<summary>The constitution of a xtal-element</summary>

Development of a xtal-element consists of checks and balances between these mental "branches" of development:

1.  The "Majestic Judicial branch".   An mjs file that is only used by node.js (or deno) to build a JSON file. The browser gets true, 100% declarative JSON configuration, that can contain HTML strings.  But the developer doesn't have to edit JSON files.  The developer edits a mjs or mts file (support coming soon hopefully), and enjoys compile time checks, and edits html with the help of tagged template literals.  So xtal-element uses a light-touch, one line "compiler" via "console.log" that outputs the easy to edit / manage mjs file containing a structured object, into a JSON file the browser can consume.  The HTML defined with tagged template literals is converted to a string embedded in the JSON.  xtal-element takes that string, in the browser, and turns it into an HTML Template for repeated use. That one line console.log may evolve to generate a separate HTML file, should HTML Modules become a thing.  But for now, the browser  imports the JSON via JSON Modules.  But even in the wonderful world that awaits HTML Modules, xtal-element views the mjs / mts file as a viable location for maintaining the HTML, especially for those who desire type safety, and the HTML (module) as a compile-time target, at least until typed HTML editing is a thing.  It also allows alternative syntax to html to be used, such as markdown or [pug](https://github.com/marpple/ttl-pug)
2.  The "Concessional Branch":  CSS styling, imported via CSS Modules.
3.  "The "Ecmascript Branch".  Minimal JS boilerplate to "tie the knot" as far as registering the custom element, and specialized methods made available to the custom element class, as a last resort.  If github autopilot is accurately guessing all your next moves when writing JS, maybe it's time to encapsulate that as a declarative web component or behavior/decorator.  With current standards, we are forced to make this file serve as the entry point for our custom element.  The JS file can then import the other two files in parallel (especially if link rel=preload is used).

The JSON and CSS files can be replaced with alternative custom files for ultimate flexibility / customizability / extensibility, with no additional payload.  This is configured via optional (but highly encouraged) link rel=preload tags.

Additional files that are optional, but definitely helpful / expected for an xtal-element-based custom element:

1.  A TypeScript types file.
2.  A custom element manifest file (auto-generated.)

</details>