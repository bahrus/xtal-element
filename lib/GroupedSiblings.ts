export class GroupedSiblings extends HTMLElement{
    previousUngroupedSibling: Element | undefined;  //TODO:  Make this a weak ref?
    parentToBeRenderTo: Element | undefined;
    firstGroupedSibling: Element | undefined;
    lastGroupedSibling: Element | undefined;
    get groupedRange(){
        if(this.lastGroupedSibling !== undefined){
            const range = document.createRange();
            range.setStartBefore((this.previousUngroupedSibling || this).nextElementSibling!);
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
        
        range.setStartBefore(this.previousUngroupedSibling || this);
        let lastGroupedSibling = this.lastGroupedSibling;
        while((lastGroupedSibling as GroupedSiblings).lastGroupedSibling !== undefined){
            lastGroupedSibling = (lastGroupedSibling as GroupedSiblings).lastGroupedSibling;
        }
        range.setEndAfter(lastGroupedSibling ?? this);
        return range.extractContents();
    }

    getClosestMatch(){
        let relativeTo = this.nextElementSibling;
        if(this.matchClosest !== undefined){
            while(relativeTo !== null){
                if(relativeTo.matches(this.matchClosest)){
                    break;
                }
                relativeTo = relativeTo.nextElementSibling
            }

        }
        return relativeTo
    }

    setPreviousUngroupedSibling(retryCount: number){
        if(this.renderAfter === undefined){
            this.previousUngroupedSibling = this;
            return;
        }
        const relativeTo = this.getClosestMatch();
        if(relativeTo === null){
            if(retryCount === 0){
                setTimeout(() => {
                    this.setPreviousUngroupedSibling(retryCount + 1);
                }, 100);
                return;
            }else{
                console.error("Unable to find matching element.");
                return;
            }
        }
        const target = relativeTo.querySelector(this.renderAfter);
        if(target !== null){
            this.previousUngroupedSibling = target;
        }else{
            if(retryCount === 0){
                setTimeout(() => {
                    this.setPreviousUngroupedSibling(retryCount + 1);
                }, 100);
                return;
            }else{
                console.error("Unable to find matching element.");
                return;
            }
        }
    }

    setElementToBeRenderedTo(retryCount: number){ //TODO:  Combine this function and the function above it.
        if(this.renderAtStartOf === undefined){
            this.setPreviousUngroupedSibling(retryCount);
            return;
        }
        const relativeTo = this.getClosestMatch();
        if(relativeTo === null){
            if(retryCount === 0){
                setTimeout(() => {
                    this.setElementToBeRenderedTo(retryCount + 1);
                }, 100);
                return;
            }else{
                console.error("Unable to find matching element.");
                return;
            }
        }
        const target = relativeTo.querySelector(this.renderAtStartOf);
        if(target !== null){
            this.parentToBeRenderTo = target;
        }else{
            if(retryCount === 0){
                setTimeout(() => {
                    this.setElementToBeRenderedTo(retryCount + 1);
                }, 100);
                return;
            }else{
                console.error("Unable to find matching element.");
                return;
            }
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

    matchClosest: string | undefined;

    renderAfter: string | undefined;

    renderAtStartOf: string | undefined;
}