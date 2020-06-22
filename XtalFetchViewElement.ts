import {XtalRoomWithAView, PromisedInitViewAngle} from './XtalRoomWithAView.js';
import {AttributeProps} from './types.d.js';
import {getFullURL, IBaseLinkContainer} from './base-link-id.js';
export {define, mergeProps} from './xtal-latx.js';
export {AttributeProps} from './types.d.js';

export abstract class XtalFetchViewElement<TInitViewModel = any, TUpdateViewModel = TInitViewModel> extends XtalRoomWithAView<TInitViewModel, TUpdateViewModel> implements IBaseLinkContainer{

    static is = 'xtal-fetch-view-element';

    static attributeProps : any = ({href, reqInit, reqInitRequired, baseLinkId} : XtalFetchViewElement) => ({
        str: [href, baseLinkId],
        obj: [reqInit],
        jsonProp: [reqInit],
        bool: [reqInitRequired],
        reflect:[href, reqInitRequired]
    } as AttributeProps);

    filterInitData(data: any){
        return data as TInitViewModel;
    }

    filterUpdateData(data: any){
        return data as TUpdateViewModel;
    }

    as: 'json' | 'text' = 'json';

    get readyToInit(){return !this.disabled && this.href !== undefined && (!this.reqInitRequired || this.reqInit !== undefined)}

    initViewModel : PromisedInitViewAngle<this, TInitViewModel, TUpdateViewModel> = 
    ({href, reqInit} : Partial<XtalFetchViewElement<TInitViewModel, TUpdateViewModel>>) => new Promise<TInitViewModel>(resolve =>{
        fetch(getFullURL(this, href!), reqInit).then(resp => resp[this.as]().then(data =>{
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
    reqInitRequired!: boolean;


    baseLinkId!: string;

}