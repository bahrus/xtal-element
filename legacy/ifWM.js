export async function ifWM(instance, propagator, key, oldValue, value, notify, propInfo) {
    const { wrapTo, mapTo } = notify;
    const isDefined = value !== undefined;
    if (isDefined && wrapTo !== undefined) {
        const { key, lhs, rhs } = wrapTo;
        instance[key] = (lhs || '') + value + (rhs || '');
    }
    if (mapTo !== undefined) {
        const mapTos = Array.isArray(mapTo) ? mapTo : [mapTo];
        for (const mapToInstance of mapTos) {
            const { key, map } = mapToInstance;
            for (const test of map) {
                if (test[0] === value) {
                    instance[key] = test[1];
                    break;
                }
            }
        }
    }
}
