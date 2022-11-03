import { XtalElement } from '../XtalElement.js';
import { deconstruct, de } from '../xtal-latx.js';
export { SelectiveUpdate, PropDefGet, TransformGetter, AttributeProps, tendArgs, IXtallatXI, PropInfo, RenderContext, IHydrate, Plugins, Plugin, RenderOptions, TransformMatch, NextStep, TransformValueOptions, TransformValueObjectOptions, TransformValueArrayOptions, PropSettings, EventSettings, AttribsSettings, PSettings, PESettings, PEASettings, PEAUnionSettings, PEATSettings, PEAT$ettings, PEATUnionSettings, ArraySlot, Range, InitTransform, UpdateTransform, MetaSettings, TemplateOrTag, TemplateTagGetter, ToTOrFnToTot, AT, ATR, ATRI, ATRIU, ATRIUM, ATRIUM_Loop, EvaluatedAttributeProps } from '../types.js';
export { XtallatX, camelToLisp, de, intersection, define, lispToCamel, mergeProps, p, symbolize } from '../xtal-latx.js';
export class XtalRoomWithAView extends XtalElement {
    /**
     * @private
     */
    refreshViewModel;
    constructor() {
        super();
        this._state = 'constructed';
        this.__controller = new AbortController();
        this.__signal = this.__controller.signal;
    }
    _viewModel;
    get viewModel() {
        return this._viewModel;
    }
    /**
     * @private
     */
    set viewModel(nv) {
        this._viewModel = nv;
        this[de]('view-model', {
            value: nv
        });
        this.onPropsChange('viewModel');
    }
    _state;
    __controller;
    __signal;
    async onPropsChange(name, skipTransform = false) {
        await super.onPropsChange(name, this.viewModel === undefined);
        if (super.disabled || !this._xlConnected || !this.readyToInit)
            return;
        switch (this._state) {
            case 'constructed':
                this._state = 'initializing';
                this.initViewModel(this).then(model => {
                    this._state = 'initialized';
                    this.viewModel = model;
                });
                return;
            case 'initializing':
                break;
            case 'initialized':
                if (this.refreshViewModel && deconstruct(this.refreshViewModel).includes(name)) {
                    this._state = 'refreshing';
                    this.refreshViewModel(this).then(model => {
                        this._state = 'refreshed';
                        this.viewModel = model;
                    });
                }
                else if (deconstruct(this.initViewModel).includes(name)) {
                    this._state = 'refreshing';
                    this.initViewModel(this).then(model => {
                        this._state = 'refreshed';
                        this.viewModel = model;
                    });
                }
                break;
        }
    }
}
