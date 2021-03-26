/**
 * Increment "disabled" counter, create if doesn't exist
 * @param elem
 */
export function zzz(elem) {
    const da = elem.getAttribute('disabled');
    if (da === null) {
        elem.setAttribute('disabled', "1");
    }
    else {
        elem.setAttribute('disabled', (parseInt(da) + 1).toString());
    }
}
