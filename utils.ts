export function createTemplate(innerHTML: string): HTMLTemplateElement {
    const template = document.createElement("template") as HTMLTemplateElement;
    template.innerHTML = innerHTML;
    return template;
}