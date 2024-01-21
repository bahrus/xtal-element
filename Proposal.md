# Observing Observed Attributes API

An interesting, unexpected (to me) point was raised as part of the discussion about how the platform can support custom attributes / behaviors / enhancements.  Paraphrasing the concern in a way that makes sense to me:

Why would we introduce new ways for the platform to recognize custom attributes associated with elements (built-in or custom) when we haven't really made it easy for custom elements to manage their own attributes first?

It's true that managing the relationship between attributes and their associated properties is a non-trivial task, that the platform has shied away from providing a comprehenive solution for, leaving this as something userland can (optionally) support in their libraries.

Perhaps this decision was wise, as the best way to manage the relationship between attributes and properties might not always be obvious, especially as custom elements may tend to pioneer scenarios well beyond anything built-in elements have yet to tackle (such as supporting [JSON in attributes](https://www.webcomponents.org/element/@google-web-components/google-chart)).

I don't know that we are anywhere closer to having a consensus on how best to manage them.  I suspect we won't until support for decorators has been built into all the browsers, for starters.

But for now, this proposal is suggesting some minimal steps forward that I at least would find helpful, that seem like useful, uncontroversial (?) primitives a more encompassing solution down the road would leverage, that would help reduce the footprint of web component libraries that assist with developer ergonomics.

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
        },

    ]
    connectedCallback(){
        const observer = Object.observeObservedAttributes(this);
        const initialState = Object.parseObservedAttributes(this);
        observer.addEventListener('parsed-object-changed', e => {
            const {modifiedObjectFieldValues, preModifiedFieldValues} = e;
            console.log({modifiedObjectFieldValues, preModifiedFieldValues});
            
        });
        Object.setAttributes([{'my-legacy-attr-1': 'hello'}, {'membership-start-date': '2024-11-10'}]);
        
    }
}
```

The initialState would be a full object representation of all the (parsed) attribute values after the server rendering of the element has completed (is there a distinct hook that the platform knows of when this could happen?), keyed off the attribute name, unless a mapsTo field is provided.  

If one of the observed attributes isn't present, it would be part of this parsed object, but the value would be null.

Standard parsers for Date, Number, Object (meaning JSON.parse), RegExp, maybe even hyperlinks would be provided. 

Object.observeObservedAttributes() would be useful, as it could allow multiple loosely coupled parties (including external users) to tap into the changes.  In fact, all the new functionality mentioned here would be available to interested third parties.

The modifiedObjectFieldValues, and preModifiedFieldValues would also be objects, partial objects of the full parsedObservedAttributes, indicating what changed (before and after).  I only recommend including the 

I think it would be useful to add "transactional support", so that multiple attributes could be changed in one go, spawning a single parse and event transmitted all in one 

