import {XtalRoomWithAView, PromisedInitViewAngle} from './XtalRoomWithAView.js';
import {AttributeProps} from './types.d.js';
export {define, mergeProps} from './xtal-latx.js';
export {AttributeProps} from './types.d.js';

export abstract class XtalFetchViewElement<TInitViewModel = any, TUpdateViewModel = TInitViewModel> extends XtalRoomWithAView<TInitViewModel, TUpdateViewModel>{

    static is = 'xtal-fetch-view-element';

    static attributeProps = ({href, reqInit, reqInitRequired} : XtalFetchViewElement) => ({
        str: [href],
        obj: [reqInit],
        jsonProp: [reqInit],
        bool: [reqInitRequired],
        reflect:[href, reqInitRequired]
    } as AttributeProps)

    filterInitData(data: any){
        return data as TInitViewModel;
    }

    filterUpdateData(data: any){
        return data as TUpdateViewModel;
    }

    get readyToInit(){return !this.disabled && this.href !== undefined && (!this.reqInitRequired || this.reqInit !== undefined)}

    initViewModel : PromisedInitViewAngle<this, TInitViewModel, TUpdateViewModel> = 
    ({href, reqInit} : Partial<XtalFetchViewElement<TInitViewModel, TUpdateViewModel>>) => new Promise<TInitViewModel>(resolve =>{
        fetch(href!, reqInit).then(resp => resp.json().then(data =>{
            resolve(this.filterInitData(data));
        }))
    });
    

    /**
     * URL (path) to fetch.
     * @attr
     * @type {string}
     * 
     * 
     */
    href: string | undefined;



    /**
     * Object to use for second parameter of fetch method.  Can parse the value from the attribute if the attribute is in JSON format.
     * Supports JSON formatted attribute
     * @type {object}
     * @attr req-init
     */
    reqInit: RequestInit | undefined;

    /**
     * Indicates that no fetch request should proceed until reqInit property / attribute is set.
     */
    reqInitRequired = false;


}