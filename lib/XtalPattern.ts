export {XtalPattern} from '../types.d.js';
import {XtalPattern} from '../types.d.js';

const createShadow = ({domCache, clonedTemplate, self}: XtalPattern) => {
    self.attachShadow!({mode: 'open'});
    self.shadowRoot!.appendChild(clonedTemplate!);
    self.clonedTemplate = undefined;
}

//export const  

export const xp = {createShadow};