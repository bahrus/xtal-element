export class GroupedSiblings extends HTMLElement{
    startingSibling: Element | undefined;
    lastGroupedSibling: Element | undefined;
    get groupedRange(){
        if(this.lastGroupedSibling !== undefined){
            const range = document.createRange();
            range.setStartBefore((this.startingSibling || this).nextElementSibling!);
            range.setEndAfter(this.lastGroupedSibling);
            return range;
        }  
    }
    get nextUngroupedSibling(){
        if(this.lastGroupedSibling !== undefined){
            return this.lastGroupedSibling.nextElementSibling;
        }
        return this.nextElementSibling;
    }

    _doNotCleanUp = false;
    extractContents(){
        this._doNotCleanUp = true;
        const range = document.createRange();
        
        range.setStartBefore(this.startingSibling || this);
        let lastGroupedSibling = this.lastGroupedSibling;
        while((lastGroupedSibling as GroupedSiblings).lastGroupedSibling !== undefined){
            lastGroupedSibling = (lastGroupedSibling as GroupedSiblings).lastGroupedSibling;
        }
        range.setEndAfter(lastGroupedSibling ?? this);
        return range.extractContents();
    }

    setStartingSibling(retryCount: number){
        if(this.renderTo === undefined){
            this.startingSibling = this;
            return;
        }
        let relativeTo = this.nextElementSibling;
        if(this.applyToNext !== undefined){
            while(relativeTo !== null){
                if(relativeTo.matches(this.applyToNext)){
                    break;
                }
                relativeTo = relativeTo.nextElementSibling
            }

        }
        if(relativeTo === null){
            if(retryCount === 0){
                setTimeout(() => {
                    this.setStartingSibling(retryCount + 1);
                }, 100);
                return;
            }else{
                console.error("Unable to find matching element.");
                return;
            }
        }
        const target = relativeTo.querySelector(this.renderTo);
        if(target !== null){
            this.startingSibling = target;
        }
    }

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

    applyToNext: string | undefined;

    renderTo: string | undefined;
}