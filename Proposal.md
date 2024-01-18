```Typescript
class ClubMember{
    static observedAttributes = [
        'my-legacy-attr-1', 
        {
            name: 'membership-start-date'
            mapsTo: 'MemberStartDt',
            instanceOf: Date,
            customConverter: ..
        },

    ]

    parsedAttributeObjectCallback(obj: Partial<{MemberStartDt: Date}>)
}
```