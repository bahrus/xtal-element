//import {debounce} from './debounce.js';
type ElTest = (el: Element | null) => boolean;
export class NavDown{
    constructor(public seed: Element, public match: string | ElTest, public careOf: string | undefined, public notify:(nd: NavDown) => void, public max: number, public ignore: string | null = null, public mutDebounce: number = 50){
    }
    _sis!:boolean; //seed is start
    _inMutLoop = false;
    init(){
        this.addMutObs(this.seed.parentElement);
        this.sync();
        this.notify(this);
    }
    addMutObs(elToObs: Element | null) {
        if(elToObs === null) return;
        const nodes: HTMLElement[] = [];
        this._mutObs = new MutationObserver((m: MutationRecord[]) => {
            this._inMutLoop = true;
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
            this.sync();
            this._inMutLoop = false;
            this.notify(this);
        });
        this._mutObs.observe(elToObs, { childList: true });
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
                    const matchedElements = (this.careOf !== undefined) ? Array.from(ns.querySelectorAll(this.careOf)) : [ns];
                    if(matchedElements !== null) {
                        this.matches = this.matches.concat(matchedElements);
                        c++;
                        if(c >= this.max ) {
                            return;
                        }
                    }
                }
                this.sibCheck(ns, c);
                
            }
            ns = ns.nextElementSibling;
        }
    }
    _mutObs!: MutationObserver;
    public matches!: Element[];
    disconnect(){
        this._mutObs.disconnect();
    }
}