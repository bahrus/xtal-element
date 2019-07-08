export class NavDown {
    constructor(seed, match, notify, max, ignore = null, mutDebounce = 50) {
        this.seed = seed;
        this.match = match;
        this.notify = notify;
        this.max = max;
        this.ignore = ignore;
        this.mutDebounce = mutDebounce;
        this._inMutLoop = false;
    }
    init() {
        this.sync();
        import('./NDAddMut.js').then(({ addMutObs }) => {
            addMutObs(this.seed.parentElement, this);
        });
        //this.addMutObs(this.seed.parentElement);
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
                    this.matches.push(ns);
                    c++;
                    if (c >= this.max) {
                        this.notify(this);
                        return;
                    }
                    ;
                }
                this.sibCheck(ns, c);
            }
            ns = ns.nextElementSibling;
        }
        this.notify(this);
    }
    disconnect() {
        this._mutObs.disconnect();
    }
}
