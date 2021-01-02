const createShadow = ({ domCache, clonedTemplate, self }) => {
    self.attachShadow({ mode: 'open' });
    self.shadowRoot.appendChild(clonedTemplate);
    self.clonedTemplate = undefined;
};
//export const  
export const xp = { createShadow };
