import { TemplMgmt, beTransformed, propInfo } from 'trans-render/lib/mixins/TemplMgmt.js';
import { CE } from 'trans-render/froop/CE.js';
const ce = new CE({
    config: {
        tagName: 'dtr-counter',
        actions: {
            ...beTransformed,
        },
        propInfo: {
            ...propInfo
        },
        propDefaults: {
            styles: String.raw `
            <style>
                * {
                  font-size: 200%;
                }
            
                span {
                  width: 4rem;
                  display: inline-block;
                  text-align: center;
                }
            
                button {
                  width: 4rem;
                  height: 4rem;
                  border: none;
                  border-radius: 10px;
                  background-color: seagreen;
                  color: white;
                }
            </style>
            `,
            count: 30,
            hydratingTransform: {
                buttonElements: [{}, { click: { prop: 'count', plusEq: true, vft: 'dataset.d', parseValAs: 'int' } }]
            },
            shadowRootMode: 'open',
            transform: { countParts: 'count' },
            unsafeTransform: {
                countParts: ({ target }) => {
                    console.log(target);
                }
            },
            mainTemplate: String.raw `<button part=down data-d=-1>-</button><span part=count></span><button part=up data-d=1>+</button>`,
        },
    },
    mixins: [TemplMgmt],
});
