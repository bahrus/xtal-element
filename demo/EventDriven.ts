class EventDriven extends HTMLElement{
    #counter = 0;
    incrementCount(){
        this.#counter++;
    }
    connectedCallback(){
        let counter = 0; 
        const bound = this.incrementCount.bind(this);
        //this.addEventListener('changed', bound);
    }
    start(){
        const start = performance.now();
        const event = new Event('changed', {bubbles: false});
        for(let i = 0; i < 1000000; i++){
            this.dispatchEvent(event);
        }
        console.log(this.#counter);
        console.log(performance.now() - start);
    }
}
customElements.define('event-driven', EventDriven);