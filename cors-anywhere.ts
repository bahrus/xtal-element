import { XtallatX } from './xtal-latx.js';
import {hydrate} from 'trans-render/hydrate.js';

const href = 'href';
const service_url = 'service-url';
const fetch_in_progress = 'fetch-in-progress';
const fetch_complete = 'fetch-complete';
const title = 'title';

export abstract class CorsAnywhere extends XtallatX(hydrate(HTMLElement)){
    _serviceUrl: string = 'https://cors-anywhere.herokuapp.com/';
   // _serviceUrl: string = 'https://crossorigin.me/';
    /** @type {string} Url of service that gets preview.
    * 
    */
    get serviceUrl() {
        return this._serviceUrl;
    }
    set serviceUrl(val: string) {
        this.attr('service-url', val);
    }

    _href!: string;
    /** @type {string} Url to preview
    * 
    */
    get href() {
        return this._href;
    }
    set href(val: string) {
        this.attr('href', val);
    }

    _fetchInProgress!: boolean;
    get fetchInProgress(){
        return this._fetchInProgress;
    }
    set fetchInProgress(val){
        this._fetchInProgress = val;
        this.attr(fetch_in_progress, val, '');
        this.de(fetch_in_progress, {
            value: val
        })
    }

    _fetchComplete!: boolean;
    get fetchComplete(){
        return this._fetchComplete;
    }
    set fetchComplete(val: boolean, ){
        this._fetchComplete = val;
        this.attr(fetch_complete, val, '');
        this.de(fetch_complete, {
            value: val
        })
    }

    _title!: string;
    get title(){
        return this._title;
    }
    set title(val){
        this._title = val;
        this.attr(title, val);
        // this.de(title,{
        //     value: val
        // })
    }

    static get observedAttributes() {
        return super.observedAttributes.concat( [href, service_url,]);
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        super.attributeChangedCallback(name, oldValue, newValue);
        switch (name) {
            case 'href':
                this._href = newValue;
                // if(this._once) this.loadHref();
                break;
            case 'service-url':
                this._serviceUrl = newValue;
                break;

        }
        this.onPropsChange();
    }

    _connected = false;
    connectedCallback(){
        this._upgradeProperties(['disabled', href, 'serviceUrl']);
        this._connected = true;
        this.de('connected',{
            value: this.href
        });
        this.onPropsChange();
    }
    _previousURL!: string;

    abstract onPropsChange() : void;
    _controller! : AbortController;

    set abort(val: boolean){
        if(this._controller && val) this._controller.abort();
    }
    doFetch(){
        const url = this.calculateURL();
        if(this._previousURL === url) {
            this.fetchComplete = false;
            this.fetchComplete = true;
            return;
        }
        this._previousURL = url;
        this.title = "Loading...";
        this.fetchInProgress = true;
        this.fetchComplete = false;
        let init: any  = null;
        if(AbortController){
            this._controller = new AbortController();
            init = this._controller.signal;
        }
        fetch(url, {
            signal: init as AbortSignal,
        }).then(response => {
            
            this.fetchInProgress = false;
            this.processResponse(response);
            this.fetchComplete = true;
        }).catch(err => {
            if (err.name === 'AbortError') {
              console.log('Fetch aborted');
              delete this._previousURL;
            }
        })
    }

    abstract processResponse(resp: Response) : void;

    calculateURL(upLevels = 0){
        let href = this._href;
        if(upLevels){
            const split = href.split('/');
            if(upLevels === -1){
                href = [split[0], split[1], split[2]].join('/');
            }
        }
        return this._serviceUrl + href;
    }
}