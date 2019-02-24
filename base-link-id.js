export const baseLinkId = 'base-link-id';
export function BaseLinkId(superClass) {
    return class extends superClass {
        get baseLinkId() {
            return this._baseLinkId;
        }
        set baseLinkId(val) {
            this.setAttribute(baseLinkId, val);
        }
        getFullURL(tail) {
            let r = tail;
            if (this._baseLinkId) {
                const link = self[this._baseLinkId];
                if (link)
                    r = link.href + r;
            }
            return r;
        }
    };
}
