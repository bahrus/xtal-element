export function getSlicedPropDefs(propLookup) {
    return new SlicedPropDefsImpl(propLookup);
}
class SlicedPropDefsImpl {
    propLookup;
    constructor(propLookup) {
        this.propLookup = propLookup;
    }
    _propDefs;
    get propDefs() {
        if (this._propDefs === undefined) {
            const propDefs = [];
            for (const key in this.propLookup) {
                const prop = { ...this.propLookup[key] };
                prop.name = key;
                propDefs.push(prop);
            }
            this._propDefs = propDefs;
        }
        return this._propDefs;
    }
    memoize(pfn, filter) {
        if (this[pfn] === undefined) {
            let list = this.propDefs;
            if (filter !== undefined) {
                list = list.filter(p => filter(p));
            }
            this[pfn] = list.map(propDef => propDef.name);
        }
        return this[pfn];
    }
    _propNames;
    get propNames() {
        if (this._propNames === undefined) {
            this._propNames = this.propDefs.map(propDef => propDef.name);
        }
        return this.memoize('_propNames');
    }
    _strNames;
    get strNames() {
        return this.memoize('_strNames', propDef => propDef.type === String);
    }
    _boolNames;
    get boolNames() {
        return this.memoize('_boolNames', propDef => propDef.type === Boolean);
    }
    _numNames;
    get numNames() {
        return this.memoize('_numNames', propDef => propDef.type === Number);
    }
    _parseNames;
    get parseNames() {
        return this.memoize('_parseNames', propDef => propDef.parse === true);
    }
    _syncPropNames;
    get syncPropNames() {
        return this.memoize('_syncPropNames', propDef => propDef.syncProps === true);
    }
    _ignoreList;
    get ignoreList() {
        return this.memoize('_ignoreList', propDef => propDef.stopReactionsIfFalsy === true);
    }
    _gotIgnoreList;
    get ignoreListOnce() {
        if (this._gotIgnoreList)
            return undefined;
        this._gotIgnoreList = true;
        return this.ignoreList;
    }
}
