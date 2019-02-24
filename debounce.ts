export const debounce = (fn: (args: any) => void, time: number) => {
    let timeout: any;
    return function (this: Function) {
        const functionCall = () => fn.apply(this, <any>arguments);
        clearTimeout(timeout);
        timeout = setTimeout(functionCall, time);
    }
}