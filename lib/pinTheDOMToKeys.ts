import { camelToLisp } from 'trans-render/lib/camelToLisp.js';
import { substrBefore } from './substrBefore.js';

export function pinTheDOMToKeys(fragment: HTMLElement | DocumentFragment, refs: { [key: string]: string | symbol }, cache: any) {
    const rootNode = fragment.getRootNode() as DocumentFragment; //can't remember why getting the root node
    const attribs = [['id', 'ids'], ['part', 'parts'], ['class', 'classes'], ['attrib', 'attribs'], ['element', 'elements']];

    for (const key in refs) {
        let lookup = refs[key];
        let subQuery = '';
        const isEmpty = lookup === '';
        if (typeof lookup !== 'symbol') {
            subQuery = lookup;
            lookup = refs[key] = Symbol(key);
        }
        const lpKey = camelToLisp(key);
        for (const attrib of attribs) {
            const isSingular = lpKey.endsWith(attrib[0]);
            const isPlural = !isSingular && lpKey.endsWith(attrib[1]);
            if (isSingular || isPlural) {
                const matchingAttrib = isSingular ? attrib[0] : attrib[1];
                const attribVal = substrBefore(lpKey, '-' + (isSingular ? attrib[0] : attrib[1]));
                let query: string | undefined;
                switch (matchingAttrib) {
                    case 'ids':
                    case 'id':
                        query = `#${attribVal}`;
                        break;
                    case 'parts':
                    case 'part':
                        query = `[part="${attribVal}"]`;
                        break;
                    case 'classes':
                    case 'class':
                        query = `.${attribVal}`;
                        break;
                    case 'attrib':
                    case 'attribs':
                        query = `[${attribVal}]`;
                        break;
                    case 'elements':
                    case 'element':
                        query = attribVal;
                        break;
                }
                let matches: HTMLElement[]
                if (isSingular) {
                    const firstMatchingNode = rootNode.querySelector(query!);
                    cache[lookup] = firstMatchingNode;                    
                } else {
                    let matchingNodes = Array.from(rootNode.querySelectorAll(query!));
                    if(subQuery !== ''){
                        matchingNodes = matchingNodes.filter(el => el.matches(subQuery))
                    }
                    cache[lookup] = matchingNodes;
                }
                break;
            }
        }
    }

}