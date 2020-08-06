import { XtalRoomWithAView } from './XtalRoomWithAView.js';
import { getFullURL } from './base-link-id.js';
export * from './xtal-latx.js';
export * from './types.d.js';
export class XtalFetchViewElement extends XtalRoomWithAView {
    constructor() {
        super(...arguments);
        this.as = 'json';
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
    get readyToInit() { return !this.disabled && this.href !== undefined && (!this.reqInitRequired || this.reqInit !== undefined); }
}
XtalFetchViewElement.is = 'xtal-fetch-view-element';
XtalFetchViewElement.attributeProps = ({ href, reqInit, reqInitRequired, baseLinkId, viewModel }) => ({
    str: [href, baseLinkId],
    obj: [reqInit, viewModel],
    jsonProp: [reqInit],
    bool: [reqInitRequired],
    reflect: [href, reqInitRequired]
});
