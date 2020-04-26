import {createTemplate} from 'trans-render/createTemplate.js';
import {TransformRules} from 'trans-render/init.d.js';
import {interpolate} from 'trans-render/interpolate.js';
import {XtalElement} from '../xtal-element.js';

const main = Symbol();
const name = 'name';
export class MiniMal extends XtalElement{

    //#region Required Members
    get readyToInit(){return true;}
    get readyToRender(){return true;}

    get mainTemplate(){return createTemplate(/* html */`
        <style>
        .btn {
            font-size: 200%;
        }
        </style>
        <button class="btn">Hello |.name ?? World|</slot></button>
    `, MiniMal, main)};

    get initTransform(){ 
        return {
            button: [{},{click: this.clickHandler}]
        } as TransformRules
    };

    #updateTransform = {
        button: ({target}) => interpolate(target, 'textContent', this, false),
    } as TransformRules;
    get updateTransform(){
        return this.#updateTransform;
    }
    //#endregion

    clickHandler(e: Event){
        this.name = 'me';
    }

    //#region boilerplate code
    #name!: string;
    get name(){
        return this.#name;
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
                this.#name = nv;
                break;
        }
        this.onPropsChange();
    }
    //#endregion
}
customElements.define('mini-mal', MiniMal);