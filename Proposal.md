# Observing the Observed Attributes API

Author:  Bruce B. Anderson

Last update: 2024-06-07

An interesting, unexpected (to me) point was raised as part of the discussion about how the platform can support custom attributes / behaviors / [enhancements](https://github.com/WICG/webcomponents/issues/1000).  Paraphrasing the concern in a way that makes sense to me:

> Why would we introduce new ways for the platform to recognize custom attributes associated with elements (built-in or custom) when we haven't really made it easy for custom elements to manage their own attributes yet?  Shouldn't we fix that first?

It's true that managing the relationship between attributes and their associated properties is a non-trivial task.  The platform has thus far shied away from providing a comprehensive solution for this, leaving it up to userland to provide such solutions in their libraries.

Perhaps this decision was wise, as the best way to manage the relationship between attributes and properties might not always be obvious, especially as custom elements may tend to pioneer scenarios well beyond anything built-in elements have yet to tackle (such as supporting [JSON in attributes](https://www.webcomponents.org/element/@google-web-components/google-chart)).

I don't know that [we are anywhere closer](https://www.abeautifulsite.net/posts/reflection-and-custom-states-in-web-components/) to having a consensus on how best to manage them at present.  I suspect we won't until support for decorators has been built into all the browsers, for starters.

But for now, this proposal is suggesting some minimal steps forward that I, at least, would find helpful.  I'm hoping they may be useful and uncontroversial primitives today, and that a more encompassing solution could leverage them in the future, when the time is right. But for the time being, the goal is that these primitives could already help reduce the footprint of web component libraries that assist with developer ergonomics.

These primitives would also have the added side effect of providing a more official channel for publishing details about the web component, something that has, up to now, been provided exclusively by the Custom Element Manifest.   I suspect that initiative would happily tap into whatever official reflection opportunities the platform provides.

In discussions with the React framework team regarding ways React could be able to set attribute values, for styling purposes, before the element had upgraded, and then switching over to the more powerful and efficient associated properties (avoiding excessive string parsing), this (currently lacking) official support might have helped us to find a more satisfying solution.  Lack of official support was a significant limiting factor.

Perhaps most importantly, **declaratively exposing to the platform the strategy for how the custom element (or custom enhancement) goes about parsing its observed attributes would give the platform (and userland implementations) the opportunity to optimize this processing during template instantiation** -- scenarios where the attributes are repeatedly cloned and (if necessary) re-parsed.  If the platform ever makes it to the point where it provides official support for template instantiation, it could look for optimizing opportunities -- cache the parsed strings.  In the meantime, userland implementations of template instantiation could take advantage of the same sorts of optimizations **without requiring adopting a proprietary solution**, but rather, based on this standard.

As has been pointed out [here](https://web.dev/articles/custom-elements-best-practices#avoid_reentrancy_issues) and [there](https://jakearchibald.com/2024/attributes-vs-properties/), for attributes/properties where the property is of type string, or boolean, the issue of "excessive string parsing" argument doesn't hold much weight as far as using the attribute value (or lack of the presence of the attribute) as the "source of truth" for the property values.  But this argument doesn't apply to other types (numeric, dates and especially JSON/Object types).

In the spirit of "the source of truth will set you free" I did a quick test of the timing difference between using attributes as the "source of truth" vs a property, focusing on the most "borderline" case -- where the property is of type number.  The results are [in line](https://github.com/bahrus/xtal-element/blob/baseline/demo/misc/numberAttribTest.html) with what I expected:

> 149.5 milliseconds passing number prop
> 238 milliseconds passing via attribute
> 189 milliseconds passing number prop
> 386.5 milliseconds passing via attribute
> 227 milliseconds passing number prop
> 275.09999999403954 milliseconds passing via attribute
> 229.09999999403954 milliseconds passing number prop
> 305.90000000596046 milliseconds passing via attribute

So it seems to me taking an "attribute-first" approach to data types other than strings and booleans will only add to global warming, just to avoid setting a flag saying "hold off on reflecting any of these attributes" (the code sample below will clarify what I mean).  

Even using attributes as the source of truth for [strings](https://github.com/bahrus/xtal-element/blob/baseline/demo/misc/strAttribTest.html) and [booleans](https://github.com/bahrus/xtal-element/blob/baseline/demo/misc/boolAttribTest.html), which the platform seems to have adopted, appears to suffer from a smaller, but not insignificant global warming catastrophe:

> 119.59999999403954 milliseconds passing string prop
> 181.40000000596046 milliseconds passing via attribute
> 114.8999999910593 milliseconds passing string prop
> 242.6000000089407 milliseconds passing via attribute
> 139.40000000596046 milliseconds passing string prop
> 258.69999998807907 milliseconds passing via attribute

> 63.5 milliseconds passing boolean prop
> 99.69999998807907 milliseconds passing via attribute
> 75.2999999821186 milliseconds passing boolean prop
> 78.90000000596046 milliseconds passing via attribute
> 86.2999999821186 milliseconds passing boolean prop
> 117.19999998807907 milliseconds passing via attribute

The same gap is observed in all three browsers.

Oops?

The other factor that the latter article points out is that some attributes may be used only for configuration.  Other attributes may be used primarily to "reflect state" for styling purposes (but the [newly adopted](https://caniuse.com/mdn-api_customstateset) custom state api [may perhaps](https://knowler.dev/blog/please-keep-your-hands-arms-and-legs-inside-the-custom-element) serve that purpose more effectively.)

How are the different ways attributes can be used relevant to the proposed API? How can the platform provide the most effective help for managing attributes, given the different kinds of use cases we want to support?  I think the most relevant questions for the developer are: 

1.  Will only the initial value ever be used?
2.  Will the (parsed) attribute value need to immediately, reactively trigger some action anytime it changes?
3.  Will needing to know that the value has changed from before be useful for "book-keeping purposes", knowing that when it comes time to know what the actual value is,  only then should we read and parse the value(s) "on demand"?
4.  Is the normal expectation that server-rendering of initial configuration and/or state will be provided for rapid, simple hydration purposes, but after that, the preference is for client-side code/frameworks to pass in updates via props, while (reluctantly) continuing to provide support for updates passed via attributes  (but frowned upon)?

## The proposal, in a nutshell

For starters, I think we could modify the observedAttributes static property, so it could support configuration type objects, where details are spelled out:

```Typescript


class ClubMember extends HTMLElement{
    static observedAttributes = [
        'my-legacy-attr-1', 
        {
            //attribute name
            name: 'membership-start-date',
            //associated property name
            mapsTo: 'memberStartDt',
            //needed if not a string,
            instanceOf: Date, //or 'Date'
            //optional
            customParser: (newValue: string | null, oldValue: string | null, instance: Element) => new Date(newValue),
            //optional
            valIfNull: any,
            /**
             * optional -- only read, (optionally) parse, and trigger "attrChange" event on encountering 
             * the initial value  (other than null), ignore after that.
             * Provide for lazy parsing on demand as needed after that.
             */
            once: true
        },
        {
            name: 'chart-data',
            instanceOf: 'Object',
            mapsTo: 'chartData',
            /**
             * optional -- triggers "attrChange" event, however doesn't parse.  It provides
             * an object with all the lazy parsed attributes which have changed / are initializing
             * which can be passed into the lazyParse method described below
             */
            lazyParse: true
        },
        {
            name: 'itemprop',
            mapsTo: 'propName',
        }
        {
            name: 'badge-color',
            mapsTo: '?.style?.backgroundColor',
            
        },
        {
            name: 'search-string',
            mapsTo: '?.enhancements?.beSearching?.for'
        }

    ]

    // This is some custom private property a library might, 
    // for example, use to know that when the value is true,
    // do not reflect changes to property values
    // back to the attributes, as that may risk getting into an 
    // infinite loop.
    #doNotReflectToAttrs = false;

    async connectedCallback(){
        const observer = customElements.observeObservedAttributes(this);
        const initialState = await customElements.parseObservedAttributes(this);
        this.#doNotReflectToAttrs = true;
        Object.assignGingerly(this, initialState);
        this.#doNotReflectToAttrs = false;
        

        observer.addEventListener('attrChange', e => {
            const {modifiedObjectFieldValues, preModifiedFieldValues, lazyParseFieldsModified} = e;
            console.log({modifiedObjectFieldValues, preModifiedFieldValues, lazyParseFieldsModified});
            this.#doNotReflectToAttrs = true;
            const parsedLazyModifiedFields = customElements.lazyParse(this, lazyParseFieldsModified);
            Object.assignGingerly(this, {...modifiedObjectFieldValues, ...parsedLazyModifiedFields});
            this.#doNotReflectToAttrs = false;
            
        });
        customElements.setAttributes(this, [
            {'my-legacy-attr-1': 'hello'}, {'membership-start-date': '2024-11-10'}
        ]);
        const memberStartDt = await customElements.lazyParse(this).memberStartDt;
        
    }
}
```
## Explanation

The initialState constant above, retrieved from *customElements.parseObservedAttributes* and *customElements.lazyParse*, would be a full object representation of all the (parsed) attribute values after the server rendering of the element tag (but not necessarily the children) has completed. Hopefully there is a distinct lifecycle event that the platform knows of when this could happen.  The keys of the object would be the attribute name (lower case?), unless a mapsTo field is provided.

In the case of observed attributes where that attribute isn't present on the element instance, that attribute key / mapsTo property would have a value of null (unless it is of Boolean type, in which case it would be false.  Other types might also treat lack of the attribute differently).  We use isSourceOfTruth to signify this.  Perhaps this should be assumed for string and boolean types.

Standard (probably not locale sensitive) parsers for Date, Number, Boolean, Object (via JSON.parse), RegExp, maybe even URL's would be baked into the platform, that would be used to provide the values of the object mentioned above.  

If the standard parsers don't satisfy a particular demand, the developer could provide a custom parser (via the customParser property).  The custom parser could choose to do something the rest of this proposal shies away from:  Actually setting property values of the instance element.

customElements.observeObservedAttributes() would be useful, as it could allow multiple loosely coupled parties (including external users) to tap into the changes and the parsing.  In fact, all the new functionality mentioned here would be available to interested third parties. (Granted, mutation observers can provide this as well).

The modifiedObjectFieldValues, and preModifiedFieldValues would also be objects, partial objects of the full parsedObservedAttributes, indicating what changed (before and after).  For property values we don't need to parse right away, a list (as a set of strings?) of such "dirty" attributes would be provided as "lazyParseFieldsModified".

*Object.assignGingerly* would have special logic to set properties with keys starting with "?." in a manner similar to optional chaining property access (but in reverse?):

For example:

```JavaScript
if(this.enhancements === undefined) this.enhancements = {};
if(this.enhancements.beSearching === undefined) this.enhancements.beSearching = {};
this.enhancements.beSearching.for = newVal;
```

I'm thinking that the most useful form that the lazyParseFieldsModified event object parameter could take would be a Javascript Set\<string\> of the mapsTo names (if provided).  That way, the developer could maintain a running tab of all the "dirty" attribute values via the newly minted "union" method, and parse them all in one go as soon as any one of them is needed on demand. 

If two arguments are passed into customElements.lazyParse, it looks at the second argument, and all the keys, and passes back a new object with the values of the keys provided based on the parsed attribute, again a sub-object of the fully parsed set of attributes.

If only one argument is passed into customElements.lazyParse, it passes back an object with lazy getters, allowing for getting the parsed specific property value of interest on demand (assuming no significant performance penalty from this approach.  Another approach would be to use a proxy.  Maybe there are other tricks the browser vendors could find).

In summary, the list of new methods this proposal calls for are:

1.  customElements.observeObservedAttributes(instance);
2.  customElements.parseObservedAttributes(instance);
3.  customElements.lazyParse(instance)[propName];
4.  customElements.lazyParse(instance, propObjectModelToUseForParsing)
3.  Object.assignGingerly(instance, propObject);
4.  customElements.setAttributes(instance, attrNameValuePairArray);


## A registry of custom attribute parsers / handlers?

The idea that developers could "register" a custom parser (or it seems this is what some are calling a "custom attribute") that is used across many different web components, so that we could specify a registered name as a string, rather than a function as shown above, would be rather nice, especially for declarative custom elements.  That is something that [this proposal](https://github.com/WICG/webcomponents/issues/1029) would appear to provide. 

To be clear, the proposal linked to above is advocating more than registering a simple stateless parser function.  There is a certain appeal to a number of individuals, I think, to build on the capabilities of the attribute node instance which gets instantiated with each live non-null attribute value, and be able to extend the Attribute class with a *custom class*, rather than a custom function, so that the modifications could be made to the "ownerElement" field of the class instance, and those modifications might not even be to a simple 1-1 correspondence between the name of the attribute and a top level property of the owner element.  (And that proposal even suggests being able to do this arbitrarily, independent of any suite of observed attributes). 

For [example](https://github.com/lume/custom-attributes):

```Javascript
class BgColor {
	connectedCallback() {
		this.setColor()
	}

	disconnectedCallback() {
		// cleanup here!
	}

	// Called whenever the attribute's value changes
	changedCallback() {
		this.setColor()
	}

	setColor() {
		this.ownerElement.style.backgroundColor = this.value
	}
}

customAttributes.default.define('bg-color', BgColor)
```

I'm lukewarm about that appeal personally, but there are probably some important use cases that I don't know about that makes the appeal of this seem to be so strong to some prominent members of the community.  

Another murky use case where I could possibly see the appeal is if the string that needs parsing is so complex, it would be helpful to maintain state as the value changes.  For example, maybe the back history of previous values is relevant to how the current value should be interpreted.   

So to accommodate that desire more closely with this proposal, assuming the cost of extending the AttributeNode is minimal compared to simply invoking a stateless function, what this would probably look like would be:

```Typescript
class ClubMember extends HTMLElement{
    static observedAttributes = [
        'my-legacy-attr-1', 
        {
            //attribute name
            name: 'membership-start-date',
            //associated property name
            mapsTo: 'memberStartDt',
            instanceOf: Date,
            //optional
            customParser: (newValue: string | null, oldValue: string | null, instance: Element) => new Date(newValue)
        },
        {
            name: 'badge-color',
            //optional
            mapsTo: '?.style?.backgroundColor',
            handler: 'MyCustomAttributeHandlerClassNameAsRegisteredInSomeRegistryOrOther',
        }
    ]
}
```

So to take one possible way this could work, *if* the attributeChangedCallback method of the CustomAttribute class returns a value, *and if* mapsTo is defined as above, with a dot delimiter, the parsed object would have key '?.style?.backgroundColor' set to whatever value is returned, ready to be carefully merged in to the ownerElement (using Object.assignGingerly).  Note that a simple Object.assign would throw an error, due to the style property having special protections that disallow Object.assign working in this way.

If not, if the developer does *not* specify mapsTo, and does the merge internally, at the expense of less transparency to external parties such as template instantiation engines, this would also be supported. I could see the appeal of keeping that internal logic private in some cases, while still partially benefitting from the declarative support this proposal provides, and the ability to share logic across different components.  In fact, if the platform could provide these "Custom Attributes" access to the *private* data fields of the owner element, that would seem to make the utility of this feature significantly higher.

In fact, this idea of granting the AttributeNode extra powers that could be used to "fine-tune" the element type class it is registered against, *might* actually make it more of a palatable alternative to the built-in extension "standard" that WebKit finds problematic.  

So [something like](https://github.com/whatwg/html/issues/10220):

```JavaScript
class BeFormLike extends Attribute {
	ownerElement; // element this is attached to
    elementInternals; //grants access to the element internals of elements that list this handler in the observedAttributes list

    /**
     * Called after the ownerElement is connected to the DOM fragment, even if the attribute isn't actually present.
     * Maybe?
     *
     * */
	connectedCallback() { /* ... */ }

	disconnectedCallback() { /* ... */ }

	// Called whenever the attribute's value changes
	changedCallback() { /* ... */ }

	static dataType = AttributeType.ElementAssociation;
	
}

HTMLFormElement.attributeRegistry.define("be-form-like", BeFormLike);
```

This would make custom elements that add this handler in their list of observedAttributes "Form Like", and the strange thing is we would want the custom element to be essentially behave like an HTMLFormElement, even if the "be-form-like" attribute isn't actually added to the element instance, I think.  It's just there as a reserved attribute name, that *could* be passed in values in some cases, when needed.  Or something.  Again, this isn't my proposal, I'm just spit-balling how I could sort of see the appeal of it.

I must strenuously insist that we don't get carried away by the apparent appeal of this option.  This may solve one problem well (perhaps, I'm just spit-balling here), but I still strongly believe the platform should *also* push forward with a solution to support cross-cutting ["decorator" patterns](https://en.wikipedia.org/wiki/Decorator_pattern), which [the custom enhancement proposal provides](https://github.com/WICG/webcomponents/issues/1000), that follows the more traditional view of regarding a suite of (custom) attributes as simply carriers of information in support of a single unifying "behavior/enhancement".  There may be some problems where either proposal could solve it, but I strongly believe that a robust platform would provide support for both approaches (one that is more tightly coupled to the element type it is enhancing, similar to class extensions, (or the built-in extension "standard" as ish) and one which is loosely coupled, and provides more support for highly semantic markup, and which aligns with what the industry has done (React, JQueryUI, Knockout.js, closure, wiz etc) as far as attaching custom objects onto the DOM element directly).

It is unfortunate that there is a tendency to view proposals that are somewhat related as a zero-sum game, pitting teams of developers against each other.  Yes, we don't want the platform to duplicate things unnecessarily (resulting in higher maintenance costs, learning curve, etc), but I think the differences are significant enough that these two proposal aren't an either-or.

If the issue is lack of resources able to implement both, maybe the WHATWG should dirty itself with some Kickstarter campaigns?  Look how well that worked for [Web-Awesome](https://www.kickstarter.com/projects/fontawesome/web-awesome?ref=68pa3y).  Imagine how much more could be raised for something like these proposals?  Sorry, more spit-balling.



If the cost of instantiating an extension to Attribute class is significant enough, I think an alternative mechanism to be able to just register stateless handler functions would be beneficial to declarative custom elements as well.  Maybe both could be supported?

A third option would be able to specify a method handler that is part of the owner element's prototype definition, that has the same signature as attributeChangedCallback, to pass the changed values to.  That request seems like the lowest value-add this proposal contains.   

I became aware, as a result of the discussions surrounding custom attributes / behaviors / enhancements, that there are some developers / frameworks that have found it useful to update attributes frequently, on the client side.

I think for those scenarios, it would be helpful to  add "transactional and bulk support", so that multiple attributes could be changed in one go, spawning a single parse and event notification.  That would be the purpose of customElements.setAttributes.  Or maybe it would make more sense to add another method to the base element, without breaking backwards compatibility?  This could also serve the purpose of putting less of a burden on custom element authors to weed out inconsistent states, when frameworks have to update attributes one by one.  I don't think this is very high priority, but I think it is at least worth considering.

As mentioned previously, this proposal is still shying away from actually officially *setting* property values of the custom element from the attributes automatically, without tapping into the custom features discussed above, as that may veer into "tipping the scales" unnecessarily, where there is less consensus amongst libraries.



