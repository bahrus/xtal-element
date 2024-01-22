# Observing the Observed Attributes API

An interesting, unexpected (to me) point was raised as part of the discussion about how the platform can support custom attributes / behaviors / [enhancements](https://github.com/WICG/webcomponents/issues/1000).  Paraphrasing the concern in a way that makes sense to me:

> Why would we introduce new ways for the platform to recognize custom attributes associated with elements (built-in or custom) when we haven't really made it easy for custom elements to manage their own attributes yet?

It's true that managing the relationship between attributes and their associated properties is a non-trivial task, that the platform has shied away from providing a comprehensive solution for it, leaving this as something userland can (optionally) support in their libraries.

Perhaps this decision was wise, as the best way to manage the relationship between attributes and properties might not always be obvious, especially as custom elements may tend to pioneer scenarios well beyond anything built-in elements have yet to tackle (such as supporting [JSON in attributes](https://www.webcomponents.org/element/@google-web-components/google-chart)).

I don't know that we are anywhere closer to having a consensus on how best to manage them at present.  I suspect we won't until support for decorators has been built into all the browsers, for starters.

But for now, this proposal is suggesting some minimal steps forward that I at least would find helpful, that seem like useful, uncontroversial (?) primitives a more encompassing solution down the road would leverage, that could already help reduce the footprint of web component libraries that assist with developer ergonomics.

I think providing this would also have the added side effect of providing a more official channel for publishing details about the web component, something that has, up to now, been provided exclusively by the Custom Element Manifest for now.   I suspect that initiative would happily tap into whatever official reflection opportunities the platform provides.

In discussions with the React framework regarding ways React could balance setting attribute values for styling purposes before the element had upgraded, this official support might have helped in being able to use a single template that could be used before and after the upgrade.  Lack of official support was a significant limiting factor.

For starters, I think we could modify the observedAttributes static property, so it could accept objects, where details are spelled out:

```Typescript


class ClubMember extends HTMLElement{
    static observedAttributes = [
        'my-legacy-attr-1', 
        {
            name: 'membership-start-date'
            mapsTo: 'memberStartDt',
            instanceOf: Date,
            customParser: (newValue: string | null, oldValue: string | null, instance: this) => Date(newValue)
        }

    ]

    async connectedCallback(){
        const observer = customElements.observeObservedAttributes(this);
        const initialState = await customElements.parseObservedAttributes(this);
        observer.addEventListener('parsed-object-changed', e => {
            const {modifiedObjectFieldValues, preModifiedFieldValues} = e;
            console.log({modifiedObjectFieldValues, preModifiedFieldValues});
            
        });
        customElements.setAttributes(this, [{'my-legacy-attr-1': 'hello'}, {'membership-start-date': '2024-11-10'}]);
        
    }
}
```

The initialState constant above, retrieved from customElements.parseObservedAttributes, would be a full object representation of all the (parsed) attribute values after the server rendering of the element has completed (is there a distinct hook that the platform knows of when this could happen?).  The keys of the object would be the attribute name (lower case?), unless a mapsTo field is provided.  

If one of the observed attributes isn't present, it would be part of this parsed object, but the value would be null.

Standard (probably not locale sensitive) parsers for Date, Number, Boolean, Object (meaning JSON.parse), RegExp, maybe even hyperlinks would be provided, that would be used to provide the values of the object mentioned above.  If the standard parsers don't satisfy a particular demand, the developer could provide a custom parser (via the customParser property).

The idea that developers could "register" a custom parser that is used across many web components, so that we could specify a string rather than a function as shown above, might be nice, especially for declarative custom elements.  That is something that [this proposal](https://github.com/WICG/webcomponents/issues/1029) would appear to provide. 

customElements.observeObservedAttributes() would be useful, as it could allow multiple loosely coupled parties (including external users) to tap into the changes and the parsing.  In fact, all the new functionality mentioned here would be available to interested third parties. (Granted, mutation observers can provide this as well).

The modifiedObjectFieldValues, and preModifiedFieldValues would also be objects, partial objects of the full parsedObservedAttributes, indicating what changed (before and after).  

It seems, as a result of the discussion surrounding custom attributes / behaviors / enhancements, that there are some developers / frameworks that desire to update attributes frequently, on the client side.

I think for those scenarios, it would be helpful to  add "transactional and bulk support", so that multiple attributes could be changed in one go, spawning a single parse and event notification.  That would be the purpose of customElements.setAttributes.  Or maybe it would make more sense to add another method to the base element, without breaking backwards compatibility?  This could also serve the purpose of putting less of a burden on custom element authors to weed out inconsistent states, when frameworks have to update attributes one by one.  I don't think this is very high priority, but I think it is at least worth considering.

This proposal is still shying away from actually setting property values of the custom element from the attributes, as that may get into a part where there is less consensus among libraries.

I suspect most developers would simply be able to use Object.assign with these two methods (.observe and .parseObservedAttributes) so it really wouldn't reduce the footprint all that much to go there for now.

Maybe I'm wrong, maybe there's enough consensus that we could do the Object.assign, at least for fields where the mapsTo is specified?

