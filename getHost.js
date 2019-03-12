export function getHost(el) {
    let parent = el;
    while (parent = (parent.parentNode)) {
        if (parent.nodeType === 11) {
            return parent['host'];
        }
        else if (parent.tagName.indexOf('-') > -1) {
            return parent;
        }
        else if (parent.tagName === 'BODY') {
            return null;
        }
    }
    return null;
}
