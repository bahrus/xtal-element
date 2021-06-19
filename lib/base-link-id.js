export function getFullURL(baseLinkContainer, tail) {
    let r = tail;
    const baseLinkId = baseLinkContainer.baseLinkId;
    if (baseLinkId !== undefined) {
        const link = self[baseLinkId];
        if (link)
            r = link.href + r;
    }
    return r;
}
