import {createTemplate} from 'trans-render/createTemplate.js';
import {TransformRules} from 'trans-render/types.d.js';
import {interpolate} from 'trans-render/interpolate.js';
import {XtalElement, SelectiveUpdate} from '../XtalElement.js';
import {PropDefGet} from '../types.d.js';
const main = Symbol();
const name = 'name';
const buttonSym = Symbol();
export class MiniMal extends XtalElement{

    static attributeProps : PropDefGet = (({disabled, name} : MiniMal) => ({
        boolean: [disabled],
        string: [name]
    })) as PropDefGet<XtalElement>;

    readyToInit = true;
    readyToRender = true;

    mainTemplate = createTemplate(/* html */`
        <style>
        .btn {
            font-size: 200%;
        }
        </style>
        <button class="btn">Hello |.name ?? World|</slot></button>
        <div></div>
    `, MiniMal, main);

    
    [buttonSym]: HTMLButtonElement;
    initTransform = {
        button: [,{click: () => {this.name = 'me'}},,,buttonSym],
    } as TransformRules;


    updateTransforms = [
        ({name} : MiniMal) => ({
            [buttonSym]: ({target}) => interpolate(target, 'textContent', this, false),
        }) as TransformRules
    ] as SelectiveUpdate[];
    
    #name!: string;
    get name(){
        return this.#name;
    }
    set name(nv){
        this.#name = nv;
        this.onPropsChange('name');
    }



}
customElements.define('mini-mal', MiniMal);