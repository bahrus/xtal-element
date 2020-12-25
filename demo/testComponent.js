export class TestComponent extends HTMLElement {
    constructor() {
        super();
        this.setAttribute('iah', '');
        console.log(this.isConnected);
    }
    attributeChangedCallback(n, ov, nv) {
        console.log(this.isConnected);
    }
    connectedCallback() {
        console.log(this.isConnected);
    }
    disconnectedCallback() {
        console.log(this.isConnected);
    }
}
TestComponent.observedAttributes = ['attrib'];
customElements.define('test-component', TestComponent);
