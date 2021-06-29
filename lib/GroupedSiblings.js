export class GroupedSiblings extends HTMLElement {
    lastGroupedSibling;
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
    _doNotCleanUp = false;
    extractContents() {
        this._doNotCleanUp = true;
        const range = document.createRange();
        range.setStartBefore(this);
        let lastGroupedSibling = this.lastGroupedSibling;
        while (lastGroupedSibling.lastGroupedSibling !== undefined) {
            lastGroupedSibling = lastGroupedSibling.lastGroupedSibling;
        }
        range.setEndAfter(lastGroupedSibling ?? this);
        return range.extractContents();
    }
}
