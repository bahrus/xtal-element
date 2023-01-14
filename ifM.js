export async function ifS(instance, propagator, key, oldValue, value, notify, propInfo) {
    const { mapTo } = notify;
    if (mapTo !== undefined) {
        const { key, map } = mapTo;
        for (const test of map) {
            if (test[0] === value) {
                instance[key] = test[1];
                break;
            }
        }
    }
}
