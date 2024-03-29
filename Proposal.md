# Observing the Observed Attributes API

Author:  Bruce B. Anderson

Last update: 2024-02-29

An interesting, unexpected (to me) point was raised as part of the discussion about how the platform can support custom attributes / behaviors / [enhancements](https://github.com/WICG/webcomponents/issues/1000).  Paraphrasing the concern in a way that makes sense to me:

> Why would we introduce new ways for the platform to recognize custom attributes associated with elements (built-in or custom) when we haven't really made it easy for custom elements to manage their own attributes yet?  Shouldn't we fix that first?

It's true that managing the relationship between attributes and their associated properties is a non-trivial task.  The platform has thus far shied away from providing a comprehensive solution for this, leaving it up to userland to provide such solutions in their libraries.

Perhaps this decision was wise, as the best way to manage the relationship between attributes and properties might not always be obvious, especially as custom elements may tend to pioneer scenarios well beyond anything built-in elements have yet to tackle (such as supporting [JSON in attributes](https://www.webcomponents.org/element/@google-web-components/google-chart)).

I don't know that we are anywhere closer to having a consensus on how best to manage them at present.  I suspect we won't until support for decorators has been built into all the browsers, for starters.

But for now, this proposal is suggesting some minimal steps forward that I, at least, would find helpful.  I'm hoping they may be useful and uncontroversial primitives today, and that a more encompassing solution could leverage them in the future, when the time is right. But for the time being, the goal is that these primitives could already help reduce the footprint of web component libraries that assist with developer ergonomics.

These primitives would also have the added side effect of providing a more official channel for publishing details about the web component, something that has, up to now, been provided exclusively by the Custom Element Manifest.   I suspect that initiative would happily tap into whatever official reflection opportunities the platform provides.

In discussions with the React framework team regarding ways React could be able to set attribute values, for styling purposes, before the element had upgraded, and then switching over to the more powerful and efficient associated properties (avoiding excessive string parsing), this (currently lacking) official support might have helped us to find a more satisfying solution.  Lack of official support was a significant limiting factor.

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
            instanceOf: Date,
            //optional
            customParser: (newValue: string | null, oldValue: string | null, instance: Element) => new Date(newValue)
        },
        {
            name: 'badge-color',
            mapsTo: '?.style?.backgroundColor'
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
        

        observer.addEventListener('parsed-attrs-changed', e => {
            const {modifiedObjectFieldValues, preModifiedFieldValues} = e;
            console.log({modifiedObjectFieldValues, preModifiedFieldValues});
            this.#doNotReflectToAttrs = true;
            Object.assignGingerly(this, modifiedObjectFieldValues);
            this.#doNotReflectToAttrs = false;
            
        });
        customElements.setAttributes(this, [
            {'my-legacy-attr-1': 'hello'}, {'membership-start-date': '2024-11-10'}
        ]);
        
    }
}
```
## Explanation

The initialState constant above, retrieved from *customElements.parseObservedAttributes*, would be a full object representation of all the (parsed) attribute values after the server rendering of the element tag (but not necessarily the children) has completed. Hopefully there is a distinct lifecycle event that the platform knows of when this could happen.  The keys of the object would be the attribute name (lower case?), unless a mapsTo field is provided.  

In the case of observed attributes where that attribute isn't present on the element instance, that attribute key / mapsTo property would have a value of null (unless it is of Boolean type, in which case it would be false.  Other types might also treat lack of the attribute differently).

Standard (probably not locale sensitive) parsers for Date, Number, Boolean, Object (via JSON.parse), RegExp, maybe even URL's would be baked into the platform, that would be used to provide the values of the object mentioned above.  

If the standard parsers don't satisfy a particular demand, the developer could provide a custom parser (via the customParser property).  The custom parser could choose to do something the rest of this proposal shies away from:  Actually setting property values of the instance element.

customElements.observeObservedAttributes() would be useful, as it could allow multiple loosely coupled parties (including external users) to tap into the changes and the parsing.  In fact, all the new functionality mentioned here would be available to interested third parties. (Granted, mutation observers can provide this as well).

The modifiedObjectFieldValues, and preModifiedFieldValues would also be objects, partial objects of the full parsedObservedAttributes, indicating what changed (before and after).

*Object.assignGingerly* would have special logic to set properties with keys starting with "?." in a manner similar to optional chaining property access (but in reverse?):

For example:

```JavaScript
if(this.enhancements === undefined) this.enhancements = {};
if(this.enhancements.beSearching === undefined) this.enhancements.beSearching = {};
this.enhancements.beSearching.for = newVal;
```

In summary, the list of new methods this proposal calls for are:

1.  customElements.observeObservedAttributes(instance)
2.  customElements.parseObservedAttributes(instance)
3.  Object.assignGingerly(instance, propObject);
4.  customElements.setAttributes(instance, attrNameValuePairArray);


## A registry of custom attribute parsers / handlers?

The idea that developers could "register" a custom parser (or it seems this is what some are calling a "custom attribute") that is used across many different web components, so that we could specify a string rather than a function as shown above, would be rather nice, especially for declarative custom elements.  That is something that [this proposal](https://github.com/WICG/webcomponents/issues/1029) would appear to provide. 

To be clear, the proposal linked to above is advocating more than registering a simple stateless function.  There is a certain appeal to a number of individuals, I think, to build on the capabilities of the attribute node instance which gets instantiated with each live non-null attribute value, and be able to extend the Attribute class with a *custom class*, rather than a custom function, so that the modifications could be made to the "ownerElement" field of the class instance, and those modifications might not even be to a simple 1-1 correspondence between the name of the attribute and a top level property of the owner element.  

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

So *if* the attributeChangedCallback method of the CustomAttribute class returns a value, *and if* mapsTo is defined as above, with a dot delimiter, the parsed object would have key '?.style?.backgroundColor' set to whatever value is returned, ready to be carefully merged in to the ownerElement (using Object.assignGingerly).  Note that a simple Object.assign would throw an error, due to the style property having special protections that disallow Object.assign working in this way.

If not, if the developer does *not* specify mapsTo, and does the merge internally, at the expense of less transparency to external users, this would also be supported. I could see the appeal of keeping that internal logic private in some cases, while still partially benefitting from the declarative support this proposal provides, and the ability to share logic across different components.  In fact, if the platform could provide these "Custom Attributes" access to the *private* data fields of the owner element, that would seem to make the utility of this feature significantly higher.

If the cost of instantiating an extension to Attribute class is significant enough, I think an alternative mechanism to be able to just register stateless handler functions would be beneficial to declarative custom elements as well.  Maybe both could be supported?

A third option would be able to specify a method handler that is part of the owner element's protocol definition, that has the same signature as attributeChangedCallback, to pass the changed values to.  That request seems like the lowest value-add this proposal contains.   

I became aware, as a result of the discussions surrounding custom attributes / behaviors / enhancements, that there are some developers / frameworks that have found it useful to update attributes frequently, on the client side.

I think for those scenarios, it would be helpful to  add "transactional and bulk support", so that multiple attributes could be changed in one go, spawning a single parse and event notification.  That would be the purpose of customElements.setAttributes.  Or maybe it would make more sense to add another method to the base element, without breaking backwards compatibility?  This could also serve the purpose of putting less of a burden on custom element authors to weed out inconsistent states, when frameworks have to update attributes one by one.  I don't think this is very high priority, but I think it is at least worth considering.

As mentioned previously, this proposal is still shying away from actually officially *setting* property values of the custom element from the attributes automatically, without tapping into the custom features discussed above, as that may veer into "tipping the scales" unnecessarily, where there is less consensus amongst libraries.



