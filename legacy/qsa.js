export function qsa(css, from) {
    return [].slice.call(from.querySelectorAll(css));
}
