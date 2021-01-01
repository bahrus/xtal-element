export function applyP(host, target, p) {
    const props = p[0];
    if (props !== undefined) {
        const safeProps = Object.assign({}, props);
        delete safeProps.dataset;
        delete safeProps.style;
        Object.assign(target, safeProps);
        if (props.style !== undefined)
            Object.assign(target.style, props.style);
        if (props.dataset !== undefined)
            Object.assign(target.dataset, props.dataset);
    }
}