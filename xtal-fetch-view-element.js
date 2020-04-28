import { XtalViewElement } from './xtal-view-element.js';
import { lispToCamel } from './xtal-latx.js';
export const href = 'href';
export const req_init = 'req-init';
export const req_init_required = 'req-init-required';
export class XtalFetchViewElement extends XtalViewElement {
    filterData(data) {
        return data;
    }
    //#region required members
    get readyToInit() { return this._href !== undefined && (!this._reqInitRequired || this._reqInit !== undefined); }
    init(signal) {
        return new Promise(resolve => {
            fetch(this._href, this._reqInit).then(resp => resp.json().then(data => {
                resolve(this.filterData(data));
            }));
        });
    }
    update(signal) {
        this.root.innerHTML = '';
        return this.init(signal);
    }
    get href() {
        return this._href;
    }
    /**
     * URL (path) to fetch.
     * @attr
     * @type {string}
     *
     *
     */
    set href(val) {
        this.attr(href, val);
    }
    get reqInitRequired() {
        return this.hasAttribute(req_init_required);
    }
    get reqInit() {
        return this._reqInit;
    }
    /**
     * Object to use for second parameter of fetch method.  Can parse the value from the attribute if the attribute is in JSON format.
     * Supports JSON formatted attribute
     * @type {object}
     * @attr req-init
     */
    set reqInit(val) {
        this._reqInit = val;
        //this.__loadNewUrlDebouncer();
        this.onPropsChange();
    }
    /**
     * Indicates that no fetch request should proceed until reqInit property / attribute is set.
     */
    set reqInitRequired(val) {
        this.attr(req_init_required, val, '');
    }
    static get observedAttributes() {
        return super.observedAttributes.concat([
            /**
             * @type boolean
             * Indicates whether fetch request should be made.
             */
            href,
            req_init,
            req_init_required
        ]);
    }
    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            // case debounceDuration:
            //     this._debounceDuration = parseFloat(newValue);
            //     this.debounceDurationHandler();
            //     break;
            case req_init_required:
                //case cacheResults:
                this['_' + lispToCamel(name)] = newValue !== null;
                break;
            // case baseLinkId:
            //     this._baseLinkId = newValue;
            //     break;
            case req_init:
                this._reqInit = JSON.parse(newValue);
                break;
            case href:
                this._href = newValue;
                break;
        }
        super.attributeChangedCallback(name, oldValue, newValue);
    }
    connectedCallback() {
        this.propUp([href, 'reqInit', 'reqInitRequired']);
        super.connectedCallback();
    }
}
