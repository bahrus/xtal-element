import {createTemplate} from 'trans-render/createTemplate.js';
import {TransformRules, TransformValueOptions, } from 'trans-render/types.d.js';
import {interpolate} from 'trans-render/interpolate.js';
import {XtalElement} from '../xtal-element.js';

const main = Symbol();
const name = 'name';
export class MiniMal extends XtalElement{

    //#region XtalElement Members
    //#region required
    readyToInit = true;
    readyToRender = true;

    mainTemplate = createTemplate(/* html */`
        <style>
        .btn {
            font-size: 200%;
        }
        </style>
        <button class="btn">Hello |.name ?? World|</slot></button>
    `, MiniMal, main);

    initTransform = {
        button: [{},{click: this.clickHandler}]
    } as TransformRules;
    //#endregion

    //#region implemented members
    updateTransform = {
        button: ({target}) => interpolate(target, 'textContent', this, false),
    } as TransformRules;
    
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
    attributeChangedCallback(name: string, oldVal: string, newVal: string){
        switch(name){
            case name:
                this.#name = newVal;
                break;
        }
        this.onPropsChange();
    }
    //#endregion
}
customElements.define('mini-mal', MiniMal);