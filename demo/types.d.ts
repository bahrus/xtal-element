export interface CounterDoProps extends Partial<HTMLElement> {
    clonedTemplate?: DocumentFragment | undefined;
    domCache?: any;
    count: number;
}