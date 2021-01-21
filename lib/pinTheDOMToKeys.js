import { camelToLisp } from 'trans-render/lib/camelToLisp.js';
export function pinTheDOMToKeys(fragment, refs, cache) {
    const rootNode = fragment.getRootNode(); //can't remember why getting the root node
    const attribs = ['id', 'part', 'class', 'data', 'element'];
    for (const key in refs) {
        let lookup = refs[key];
        let subQuery = '*';
        const isSingle = lookup === '';
        if (typeof lookup !== 'symbol') {
            subQuery = lookup;
            lookup = refs[key] = Symbol(key);
        }
        const lpKey = camelToLisp(key);
        for (const attrib of attribs) {
            if (lpKey.endsWith(attrib)) {
                const attribVal = lpKey.substr(0, lpKey.length - attrib.length - 1);
                let query;
                switch (attrib) {
                    case 'id':
                        query = `#${attribVal}`;
                        break;
                    case 'part':
                        query = `[part="${attribVal}"]`;
                        break;
                    case 'class':
                        query = `.${attribVal}`;
                        break;
                    case 'data':
                        query = `[data-${attribVal}]`;
                        break;
                    case 'element':
                        query = attribVal;
                        break;
                    default:
                        throw '';
                }
                if (isSingle) {
                    const firstMatchingNode = rootNode.querySelector(query);
                    cache[lookup] = firstMatchingNode;
                }
                else {
                    const matchingNodes = rootNode.querySelectorAll(query);
                    cache[lookup] = Array.from(matchingNodes).filter(el => el.matches(subQuery));
                }
                break;
            }
        }
    }
}
