/**
 * Decrement "disabled" counter, remove when reaches 0
 * @param elem
 */
export function nudge(elem) {
    const da = elem.getAttribute('disabled');
    if (da !== null) {
        if (da.length === 0 || da === "1") {
            elem.removeAttribute('disabled');
        }
        else {
            elem.setAttribute('disabled', (parseInt(da) - 1).toString());
        }
    }
}
