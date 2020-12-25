class MethodDriven extends HTMLElement{
    #counter = 0;
    incrementCount(){
        this.#counter++;
    }
    start(){
        const start = performance.now();
        for(let i = 0; i < 1000000; i++){
            this.incrementCount();
        }
        console.log(this.#counter);
        console.log(performance.now() - start);
    }
    start2(){
        const start = performance.now();
        for(let i = 0; i < 1000000; i++){
            this['incrementCount']();
        }
        console.log(this.#counter);
        console.log(performance.now() - start);
    }
}
customElements.define('method-driven', MethodDriven);