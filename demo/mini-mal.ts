import {createTemplate} from 'trans-render/createTemplate.js';
import {TransformRules, TransformValueOptions} from 'trans-render/init.d.js';
import {interpolate} from 'trans-render/interpolate.js';
import {XtalElement} from '../xtal-element.js';
const template = createTemplate(
    /* html */`
    <style>
    .btn {
		  font-size: 200%;
	  }
    </style>
    <button class="btn">Hello |.name ?? World|</slot></button>`
);
const name = 'name';
export class MiniMal extends XtalElement{
    get readyToInit(){return true;}
    get mainTemplate(){return template;}
    get initTransform(){ 
        return {
            button: [{},{click: this.clickHandler}]
        } as TransformRules
    };
    #updateTransform = {
        button: ({target} : {target: HTMLElement}) => interpolate(target, 'textContent', this, false),
    } as TransformRules;
    get updateTransform(){
        return this.#updateTransform;
    }
    clickHandler(e: Event){
        this.name = 'me';
    }
    _name!: string;
    get name(){
        return this._name;
    }
    set name(nv){
        this.attr(name, nv);
    }
    connectedCallback(){
        this.propUp([name]);
        super.connectedCallback();
    }
    static get observedAttributes(){
        return super.observedAttributes.concat([name]);
    }
    attributeChangedCallback(n: string, ov: string, nv: string){
        switch(n){
            case name:
                this._name = nv;
                break;
        }
        this.onPropsChange();
    }

}
customElements.define('mini-mal', MiniMal);