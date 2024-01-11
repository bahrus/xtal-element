import {TemplMgmt, TemplMgmtProps, TemplMgmtActions, beTransformed, propInfo} from 'trans-render/lib/mixins/TemplMgmt.js';
import {Localizer, LocalizerMethods} from 'trans-render/lib/mixins/Localizer.js';
import {XE} from '../XE.js';
import { XForm } from 'trans-render/types.js';

export interface DTRCounterProps {
    count: number;
} 
const ce = new XE<DTRCounterProps & TemplMgmtProps, TemplMgmtActions>({
    mixins: [TemplMgmt, Localizer],
    config:  {
        tagName:'dtr-counter',
        actions:{
            ...beTransformed,
        },
        propInfo:{
            ...propInfo
        },
        propDefaults:{
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
            xform: {
                '% count': 'localize',
                "button": {
                    m: {
                        on: 'click',
                        inc: 'count',
                        byAmt: '.dataset.d',
                    },
                }
            } as XForm<DTRCounterProps, TemplMgmtActions & LocalizerMethods>,
            shadowRootMode: 'open',
            mainTemplate: String.raw `<button part=down data-d=-1>-</button><span part=count></span><button part=up data-d=1>+</button>`,

        },
        
    },
    
});