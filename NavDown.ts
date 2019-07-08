type ElTest = (el: Element | null) => boolean;
export class NavDown{
    constructor(public seed: Element, public match: string | ElTest, public notify:(nd: NavDown) => void, public max: number, public ignore: string | null = null, public mutDebounce: number = 50){}
    _sis!:boolean; //seed is start
    _inMutLoop = false;
    init(){
        this.sync();
        import('./NDAddMut.js').then(({addMutObs}) =>{
            addMutObs(this.seed.parentElement, this);
        })
        //this.addMutObs(this.seed.parentElement);
    }

    sibCheck(sib: Element, c: number){}
    sync(c = 0){
        const isF = typeof this.match === 'function';
        this.matches = [];
        let ns = this._sis ? this.seed : this.seed.nextElementSibling;
        while(ns !== null){
            if(this.ignore === null || !ns.matches(this.ignore)){
                let isG = isF ? (<any>this.match)(ns) : ns.matches(this.match as string);
                if(isG){
                    this.matches.push(ns);
                    c++;
                    if(c >= this.max ) {
                        this.notify(this);
                        return;
                    };
                }
                this.sibCheck(ns, c);
                
            }
            ns = ns.nextElementSibling;
        }
        this.notify(this);
    }
    _mutObs!: MutationObserver;
    public matches!: Element[];
    disconnect(){
        this._mutObs.disconnect();
    }
}