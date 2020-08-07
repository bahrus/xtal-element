import { XtalRoomWithAView } from './XtalRoomWithAView.js';
import { getFullURL } from './base-link-id.js';
export { XtallatX, camelToLisp, de, intersection, define, lispToCamel, mergeProps, p, symbolize } from './xtal-latx.js';
export class XtalFetchViewElement extends XtalRoomWithAView {
    constructor() {
        super(...arguments);
        this.as = 'json';
        /**
         * @private
         * @param param0
         */
        this.initViewModel = ({ href, reqInit }) => new Promise(resolve => {
            fetch(getFullURL(this, href), reqInit).then(resp => resp[this.as]().then(data => {
                resolve(this.filterInitData(data));
            }));
        });
    }
    filterInitData(data) {
        return data;
    }
    filterUpdateData(data) {
        return data;
    }
    /**
     * @private
     */
    get readyToInit() { return !this.disabled && this.href !== undefined && (!this.reqInitRequired || this.reqInit !== undefined); }
}
XtalFetchViewElement.is = 'xtal-fetch-view-element';
/**
 * @private
 * @param param0
 */
XtalFetchViewElement.attributeProps = ({ href, reqInit, reqInitRequired, baseLinkId, viewModel }) => ({
    str: [href, baseLinkId],
    obj: [reqInit, viewModel],
    jsonProp: [reqInit],
    bool: [reqInitRequired],
    reflect: [href, reqInitRequired]
});
