import { camelToLisp } from './camelToLisp.js';
export function letThereBeProps(elementClass, props, callbackMethodName) {
    const proto = elementClass.prototype;
    const existingProps = Object.getOwnPropertyNames(proto);
    for (const prop of props) {
        const name = prop.name;
        if (existingProps.includes(name))
            return;
        const privateKey = '_' + name;
        Object.defineProperty(proto, name, {
            get() {
                return this[privateKey];
            },
            set(nv) {
                if (prop.dry) {
                    if (nv === this[privateKey])
                        return;
                }
                if (prop.reflect || (this.beReflective && this.beReflective.includes(name))) {
                    switch (prop.type) {
                        case Boolean:
                            {
                                const nameIs = 'Is' + name[0].toUpperCase() + name.substr(1);
                                const isUndefined = this.dataset[nameIs] === undefined;
                                if (nv && isUndefined) {
                                    this.dataset[nameIs] = '';
                                }
                                else if (!isUndefined) {
                                    delete this.dataset[nameIs];
                                }
                            }
                            break;
                        case String:
                        case Number:
                            {
                                const nameIs = name + 'Is';
                                if (nv !== undefined)
                                    this.dataset[nameIs] = nv;
                            }
                            break;
                        case Object:
                            {
                                const nameIs = name + 'Is';
                                if (nv !== undefined)
                                    this.dataset[nameIs] = JSON.stringify(nv);
                            }
                            break;
                    }
                }
                this[privateKey] = nv;
                if (prop.log) {
                    console.log(prop, nv);
                }
                if (prop.debug)
                    debugger;
                if (callbackMethodName !== undefined)
                    this[callbackMethodName](name, prop, nv);
                if (prop.notify !== undefined) {
                    const eventInit = {
                        detail: {
                            value: nv
                        }
                    };
                    Object.assign(eventInit, prop.notify);
                    this.dispatchEvent(new CustomEvent(camelToLisp(name) + '-changed'), eventInit);
                }
            },
            enumerable: true,
            configurable: true,
        });
    }
}
