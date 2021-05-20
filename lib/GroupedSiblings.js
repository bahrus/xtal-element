export class GroupedSiblings extends HTMLElement {
    constructor() {
        super(...arguments);
        this._doNotCleanUp = false;
        // getMatchingElement(cssSelector: string){
        //     let nextSibling = this.nextElementSibling;
        //     while(nextSibling !== null){
        //         if(nextSibling.matches(cssSelector)) return nextSibling;
        //         const el  = nextSibling.querySelector(cssSelector);
        //         if(el !== null) return el;
        //         if(nextSibling === this.lastGroupedSibling) return null;
        //     }
        //     return null;
        // }
    }
    get groupedRange() {
        if (this.lastGroupedSibling !== undefined) {
            const range = document.createRange();
            range.setStartBefore(this.nextElementSibling);
            range.setEndAfter(this.lastGroupedSibling);
            return range;
        }
    }
    get nextUngroupedSibling() {
        if (this.lastGroupedSibling !== undefined) {
            return this.lastGroupedSibling.nextElementSibling;
        }
        return this.nextElementSibling;
    }
    extractContents() {
        this._doNotCleanUp = true;
        const range = document.createRange();
        range.setStartBefore(this);
        range.setEndAfter(this.lastGroupedSibling ?? this);
        return range.extractContents();
    }
}
