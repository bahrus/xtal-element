import { XtalRoomWithAView } from './XtalRoomWithAView.js';
export { define, mergeProps } from './xtal-latx.js';
let XtalFetchViewElement = /** @class */ (() => {
    class XtalFetchViewElement extends XtalRoomWithAView {
        constructor() {
            super(...arguments);
            this.initViewModel = ({ href, reqInit }) => new Promise(resolve => {
                fetch(href, reqInit).then(resp => resp.json().then(data => {
                    resolve(this.filterInitData(data));
                }));
            });
            /**
             * Indicates that no fetch request should proceed until reqInit property / attribute is set.
             */
            this.reqInitRequired = false;
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
    XtalFetchViewElement.propAttributes = ({ href, reqInit, reqInitRequired }) => ({
        str: [href],
        obj: [reqInit],
        jsonProp: [reqInit],
        bool: [reqInitRequired],
        reflect: [href, reqInitRequired]
    });
    return XtalFetchViewElement;
})();
export { XtalFetchViewElement };
