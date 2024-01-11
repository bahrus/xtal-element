import {XE} from './XE.js';
import {
    XtalElementEndUserProps,
    XtalElementActions,
    XtalElementAllProps
} from './types.js';

export class XtalElement extends HTMLElement implements XtalElementActions {
    async define(self: this) {
        console.log('iah');
        return {
            resolved: true
        }
    }
}

export interface XtalElement extends XtalElementEndUserProps {

}

const xe = new XE<XtalElementAllProps, XtalElementActions>({
    superclass: XtalElement,
    config: {
        tagName: 'xtal-element',
        propDefaults: {
            isAttrParsed: false,
            targetScope: 'porn',
            inferProps: false,
            propInferenceCriteria: [{
                cssSelector: '[itemprop]',
                attrForProp: 'itemprop',
            }],

        },
        propInfo:{
            shadowRootMode: {
                type: 'String'
            },
            xform: {
                type: 'Object'
            },
            aka: {
                type: 'String'
            },
            mainTemplate: {
                parse: false,
                type: 'Object'
            },
            resolved: {
                notify:{
                    dispatch: true,
                }
            }
        },
        style: {
            display: 'none'
        },
        actions:{
            define: 'isAttrParsed'
        }
    },
})