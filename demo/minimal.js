import { XtalElement } from '../xtal-element.js';
import { createTemplate } from '../utils.js';
import { init } from 'trans-render/init.js';
const template = createTemplate(/* html */ `<div></div>`);
export class Minimal extends XtalElement {
    get eventSwitchContext() {
        return {};
    }
    get renderContext() {
        return {
            init: init,
            transform: {
                div: x => this.viewModel
            }
        };
    }
    async init() {
        return new Promise(resolve => {
            resolve('Greetings, Earthling.');
        });
    }
    async update() {
        this.root.innerHTML = '';
        return this.init();
    }
    get mainTemplate() {
        return template;
    }
    get ready() { return true; }
}
customElements.define('mini-mal', Minimal);
//# sourceMappingURL=minimal.js.map