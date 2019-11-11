export class NavDown {
    //_debouncer!: any;
    constructor(seed, match, careOf, notify, max, ignore = null, mutDebounce = 50) {
        this.seed = seed;
        this.match = match;
        this.careOf = careOf;
        this.notify = notify;
        this.max = max;
        this.ignore = ignore;
        this.mutDebounce = mutDebounce;
        this._inMutLoop = false;
        //this.init();
    }
    init() {
        // this._debouncer = debounce(() =>{
        //     this.sync();
        // }, this.mutDebounce);
        this.addMutObs(this.seed.parentElement);
        this.sync();
        this.notify(this);
    }
    addMutObs(elToObs) {
        if (elToObs === null)
            return;
        const nodes = [];
        this._mutObs = new MutationObserver((m) => {
            this._inMutLoop = true;
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
            this.sync();
            this._inMutLoop = false;
            this.notify(this);
            //this._debouncer(true);
        });
        this._mutObs.observe(elToObs, { childList: true });
        // (<any>elToObs)._addedMutObs = true;
    }
    sibCheck(sib, c) { }
    sync(c = 0) {
        const isF = typeof this.match === 'function';
        this.matches = [];
        let ns = this._sis ? this.seed : this.seed.nextElementSibling;
        while (ns !== null) {
            if (this.ignore === null || !ns.matches(this.ignore)) {
                let isG = isF ? this.match(ns) : ns.matches(this.match);
                if (isG) {
                    const matchedElement = (this.careOf !== undefined) ? ns.querySelector(this.careOf) : ns;
                    if (matchedElement !== null) {
                        this.matches.push(matchedElement);
                        c++;
                        if (c >= this.max) {
                            //this.notify(this);
                            return;
                        }
                    }
                }
                this.sibCheck(ns, c);
            }
            ns = ns.nextElementSibling;
        }
        //this.notify(this);
    }
    disconnect() {
        this._mutObs.disconnect();
    }
}
