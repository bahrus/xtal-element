import {camelToLisp} from './camelToLisp.js'; 
/**
 * xtal-element doesn't think the static observedAttributes adds much value, and only makes life more difficult for web component development.
 * xtal-element's philosophy is that attributes should only be used to 1)  Pass in initial values (from the server), which overrides default values only.  
 * 2)  Reflect property changes, but to a different attribute name (switching, eventually, hopefully, to [pseudo state](https://www.chromestatus.com/feature/6537562418053120) )
 */
function mergeBool<T = any>(self: HTMLElement, names: string[], defaultValues: T){
    for(const name of names){
        const ctl = camelToLisp(name);
        (<any>defaultValues)[name] = self.hasAttribute(ctl);
    }
}

function mergeStr<T = any>(self: HTMLElement, names: string[], defaultValues: T){
    for(const name of names){
        const ctl = camelToLisp(name);
        if(self.hasAttribute(ctl)) (<any>defaultValues)[name] = self.getAttribute(ctl);
    }
}

function mergeNum<T = any>(self: HTMLElement, names: string[], defaultValues: T){
    for(const name of names){
        const ctl = camelToLisp(name);
        if(self.hasAttribute(ctl)){
            const attrib = self.getAttribute(ctl)!;
            (<any>defaultValues)[name] = attrib.includes('.') ? parseFloat(attrib) : parseInt(attrib);
        } 
    }
}

function mergeObj<T = any>(self: HTMLElement, names: string[], defaultValues: T){
    for(const name of names){
        const ctl = camelToLisp(name);
        if(self.hasAttribute(ctl)) (<any>defaultValues)[name] = JSON.parse(self.getAttribute(ctl)!);
    }
}

export const attr = {mergeBool, mergeStr, mergeObj, mergeNum};

