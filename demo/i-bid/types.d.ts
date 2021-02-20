
export interface IbIdProps extends Partial<HTMLElement>{
    tag?: string | undefined;
    map? : undefined | ((x: any, idx?: number) => any);
    list: any[],
    initCount?: number | undefined;
    initialized?: boolean | undefined;
    ownedSiblings?: WeakSet<Element>;
    grp1?: (x: any) => string;
    grp1LU: {[key: string] : Element[]}
}

declare global {
    interface HTMLElementTagNameMap {
        "ib-id": IbIdProps,
    }
}