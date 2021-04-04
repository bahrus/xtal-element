//https://surma.dev/things/deep-copy/index.html

export function structuralClone(obj: any) {
    const oldState = history.state;
    history.replaceState(obj, document.title);
    const copy = history.state;
    history.replaceState(oldState, document.title);
    return copy;
}