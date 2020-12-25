export class TestComponent extends HTMLElement{
    constructor(){
        super();
        this.setAttribute('iah', '');
        console.log(this.isConnected);
    }
    static observedAttributes = ['attrib'];
    attributeChangedCallback(n: string, ov: string, nv: string){
        console.log(this.isConnected);
    }
    connectedCallback(){
        console.log(this.isConnected);
    }
    disconnectedCallback(){
        console.log(this.isConnected);
    }
}
customElements.define('test-component', TestComponent);