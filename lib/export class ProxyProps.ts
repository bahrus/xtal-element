import {lispToCamel} from 'trans-render/lib/lispToCamel.js';
import {GroupedSiblings} from './GroupedSiblings.js';

export class ProxyProps extends GroupedSiblings{
    createProxies(){
        const elementProxyEnding = '-element-proxy';
        for(const name of this.getAttributeNames()){
            if((name[0] === '-') && name.endsWith(elementProxyEnding)){
                let elementName = name.substr(1, name.length - elementProxyEnding.length - 1);

            }
        }
    }
}