export function addMutObs(elToObs, el) {
    if (elToObs === null)
        return;
    const nodes = [];
    el._mutObs = new MutationObserver((m) => {
        el._inMutLoop = true;
        m.forEach(mr => {
            mr.addedNodes.forEach(node => {
                if (node.nodeType === 1) {
                    const el = node;
                    el.dataset.__pdWIP = '1';
                    nodes.push(el);
                }
            });
        });
        nodes.forEach(node => delete node.dataset.__pdWIP);
        el.sync();
        el._inMutLoop = false;
    });
    el._mutObs.observe(elToObs, { childList: true });
}
