import { lispToCamel } from 'trans-render/lib/lispToCamel.js';
export class GroupedSiblings extends HTMLElement {
    constructor() {
        super(...arguments);
        this._doNotCleanUp = false;
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
    getMatchingElement(cssSelector) {
        let nextSibling = this.nextElementSibling;
        while (nextSibling !== null) {
            if (nextSibling.matches(cssSelector))
                return nextSibling;
            const el = nextSibling.querySelector(cssSelector);
            if (el !== null)
                return el;
            if (nextSibling === this.lastGroupedSibling)
                return null;
        }
        return null;
    }
    createRefs(fragment) {
        const elementRefEnding = '-element-ref';
        for (const name of this.getAttributeNames()) {
            if ((name[0] === '-') && name.endsWith(elementRefEnding)) {
                let elementName = name.substr(1, name.length - elementRefEnding.length - 1);
                const key = lispToCamel(name.substr(1));
                const currentVal = this[key];
                const matchingEl = fragment.querySelector(elementName);
                if (matchingEl !== null) {
                    this[key] = matchingEl;
                    if (currentVal !== undefined && !(currentVal instanceof HTMLElement)) {
                        Object.assign(matchingEl, currentVal);
                    }
                }
                else {
                    //release DOM element from memory
                    if (currentVal instanceof HTMLElement) {
                        delete (this[key]);
                    }
                }
            }
        }
    }
}
