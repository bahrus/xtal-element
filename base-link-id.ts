export interface IBaseLinkContainer{
    baseLinkId: string | undefined;
}

export function getFullURL(baseLinkContainer: IBaseLinkContainer, tail: string){
    let r = tail;
    const baseLinkId = baseLinkContainer.baseLinkId;
    if(baseLinkId !== undefined){
        const link = (<any>self)[baseLinkId] as HTMLLinkElement;
        if(link) r =  link.href + r;
    }
    return r;
}
