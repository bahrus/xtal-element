import {PropDef, PropDefGet, SlicedPropDefs, PropDefMap} from '../types.js';

export function getSlicedPropDefs<T = any>(propLookup: PropDefMap<T>){

    return new SlicedPropDefsImpl<T>(propLookup) as SlicedPropDefs<T>;
}

class SlicedPropDefsImpl<T = any> implements SlicedPropDefs<T>{
    constructor(public propLookup: PropDefMap<T>){}

    _propDefs: PropDef[] | undefined;
    get propDefs(){
        if(this._propDefs === undefined){
            const propDefs: PropDef[] = [];
            for(const key in this.propLookup){
                const prop = {...this.propLookup[key] as PropDef};
                prop!.name = key;
                propDefs.push(prop);
            }
            this._propDefs = propDefs;
        }
        return this._propDefs;
    }

    memoize(pfn: string, filter?: (p: PropDef) => boolean): string[]{
        if((<any>this)[pfn] === undefined){
            let list = this.propDefs;
            if(filter !== undefined){
                list = list.filter(p => filter(p));
            }
            (<any>this)[pfn] = list.map(propDef => propDef.name!);
        }
        return (<any>this)[pfn];
    }

    _propNames: string[] | undefined;
    get propNames(){
        if(this._propNames === undefined){
            this._propNames = this.propDefs.map(propDef => propDef.name!);
        }
        return this.memoize('_propNames');
    }

    _strNames: string[] | undefined;
    get strNames(){
        return this.memoize('_strNames', propDef => propDef.type === String);
    }

    _boolNames: string[] | undefined;
    get boolNames(){
        return this.memoize('_boolNames', propDef => propDef.type === Boolean);
    }

    _numNames: string[] | undefined;
    get numNames(){
        return this.memoize('_numNames', propDef => propDef.type === Number);
    }

    _parseNames: string[] | undefined;
    get parseNames(){
        return this.memoize('_parseNames', propDef => propDef.parse === true);
    }


}
