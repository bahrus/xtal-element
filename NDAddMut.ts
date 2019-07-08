export function addMutObs(elToObs: Element | null, el: any) {
    if(elToObs === null) return;
    const nodes: HTMLElement[] = [];
    el._mutObs = new MutationObserver((m: MutationRecord[]) => {
        el._inMutLoop = true;
        m.forEach(mr =>{
            mr.addedNodes.forEach(node =>{
                if(node.nodeType === 1){
                    const el = node as HTMLElement;
                    el.dataset.__pdWIP = '1';
                    nodes.push(el);
                }
            })
        });
        nodes.forEach(node => delete node.dataset.__pdWIP);
        el.sync();
        el._inMutLoop = false;
    });
    el._mutObs.observe(elToObs, { childList: true });
}