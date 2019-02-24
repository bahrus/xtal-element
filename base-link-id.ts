type Constructor<T = {}> = new (...args: any[]) => T;

export const baseLinkId = 'base-link-id';

export function BaseLinkId<TBase extends Constructor<HTMLElement>>(superClass: TBase) {

    return class extends superClass {
        _baseLinkId!: string;
        get baseLinkId() {
            return this._baseLinkId;
        }
        set baseLinkId(val) {
            this.setAttribute(baseLinkId, val);
        }


        getFullURL(tail: string) {
            let r = tail;
            if(this._baseLinkId){
                const link = (<any>self)[this._baseLinkId] as HTMLLinkElement;
                if(link) r =  link.href + r;
            }
            return r;
        }
    }

}