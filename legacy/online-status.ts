type Constructor<T = {}> = new (...args: any[]) => T;

export const online = 'online';
export function onlineStatus<TBase extends Constructor<HTMLElement>>(superClass: TBase) {

    return class extends superClass {
    }
}