import { XtalRoomWithAView } from '../XtalRoomWithAView.js';
import { getFullURL } from '../base-link-id.js';
export { SelectiveUpdate, PropDefGet, TransformGetter, AttributeProps, tendArgs, IXtallatXI, PropInfo, RenderContext, IHydrate, Plugins, Plugin, RenderOptions, TransformMatch, NextStep, TransformValueOptions, TransformValueObjectOptions, TransformValueArrayOptions, PropSettings, EventSettings, AttribsSettings, PSettings, PESettings, PEASettings, PEAUnionSettings, PEATSettings, PEAT$ettings, PEATUnionSettings, ArraySlot, Range, InitTransform, UpdateTransform, MetaSettings, TemplateOrTag, TemplateTagGetter, ToTOrFnToTot, AT, ATR, ATRI, ATRIU, ATRIUM, ATRIUM_Loop, EvaluatedAttributeProps } from '../types.js';
export { XtallatX, camelToLisp, de, intersection, define, lispToCamel, mergeProps, p, symbolize } from '../xtal-latx.js';
export class XtalFetchViewElement extends XtalRoomWithAView {
    static is = 'xtal-fetch-view-element';
    /**
     * @private
     *
     */
    static attributeProps = ({ href, reqInit, reqInitRequired, baseLinkId, viewModel }) => ({
        str: [href, baseLinkId],
        obj: [reqInit, viewModel],
        jsonProp: [reqInit],
        bool: [reqInitRequired],
        reflect: [href, reqInitRequired]
    });
    filterInitData(data) {
        return data;
    }
    filterUpdateData(data) {
        return data;
    }
    as = 'json';
    /**
     * @private
     */
    get readyToInit() { return !this.disabled && this.href !== undefined && (!this.reqInitRequired || this.reqInit !== undefined); }
    /**
     * @private
     * @param param0
     */
    initViewModel = ({ href, reqInit }) => new Promise(resolve => {
        fetch(getFullURL(this, href), reqInit).then(resp => resp[this.as]().then(data => {
            resolve(this.filterInitData(data));
        }));
    });
    /**
     * URL (path) to fetch.
     * @attr
     * @type {string}
     *
     *
     */
    href;
    /**
     * Object to use for second parameter of fetch method.  Can parse the value from the attribute if the attribute is in JSON format.
     * Supports JSON formatted attribute
     * @type {object}
     * @attr req-init
     */
    reqInit;
    /**
     * Indicates that no fetch request should proceed until reqInit property / attribute is set.
     */
    reqInitRequired;
    baseLinkId;
}
