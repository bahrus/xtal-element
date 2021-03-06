import { xc } from '../../lib/XtalCore.js';
import { applyP } from 'trans-render/lib/applyP.js';
/**
 * @element i-bid
 */
export class IBid extends HTMLElement {
    constructor() {
        super(...arguments);
        this.self = this;
        this.propActions = propActions;
        this.reactor = new xc.Rx(this);
        this.ownedSiblings = new WeakSet();
        this.grp1LU = {};
    }
    connectedCallback() {
        this.style.display = 'none';
        xc.hydrate(this, slicedPropDefs, {
            initCount: 0,
            map: identity,
            tag: (this.previousElementSibling || this.parentElement).localName,
            grp1: stdGrp1,
        });
    }
    onPropChange(name, propDef, newVal) {
        this.reactor.addToQueue(propDef, newVal);
    }
}
IBid.is = 'i-bid';
const identity = x => x;
const stdGrp1 = (x) => x.localName;
const linkInitialized = ({ initCount, self }) => {
    if (initCount !== 0) {
        markOwnership(self, initCount);
    }
    else {
        self.initialized = true;
    }
};
const onNewList = ({ initialized, grp1, list, self }) => {
    console.log(initialized);
    let ns = self;
    for (const item of list) {
        let wrappedItem = typeof (item) === 'string' ? { textContent: item } : item;
        if (wrappedItem.localName === undefined)
            wrappedItem = { localName: self.tag, ...wrappedItem };
        ns = conditionalCreate(self, wrappedItem, ns);
    }
};
const propActions = [
    linkInitialized,
    onNewList
];
const objProp1 = {
    type: Object,
    dry: true,
    stopReactionsIfFalsy: true,
    parse: true,
    async: true
};
const objProp2 = {
    type: Object,
    dry: true,
    stopReactionsIfFalsy: true,
    async: true,
};
const propDefMap = {
    list: objProp1,
    map: objProp1,
    grp1: objProp2,
    tag: {
        type: String,
        dry: true,
        async: true,
    },
    initCount: {
        type: Number,
        async: true
    },
    initialized: {
        type: Boolean,
        stopReactionsIfFalsy: true,
        dry: true,
        async: true,
    }
};
const slicedPropDefs = xc.getSlicedPropDefs(propDefMap);
xc.letThereBeProps(IBid, slicedPropDefs, 'onPropChange');
xc.define(IBid);
function markOwnership(self, initCount) {
    const { ownedSiblings } = self;
    let i = 0, ns = self;
    const nextSiblings = [];
    while (i < initCount && ns !== null) {
        i++;
        ns = ns.nextElementSibling;
        nextSiblings.push(ns);
    }
    if (i === initCount && ns !== null) {
        self.initialized = true;
        for (const ns2 of nextSiblings) {
            ownedSiblings.add(ns2);
        }
    }
    else {
        setTimeout(() => markOwnership(self, initCount), 50);
        return;
    }
}
function poolExtras(self, prevSib) {
    const { grp1, grp1LU, ownedSiblings } = self;
    let ns = prevSib.nextElementSibling;
    while (ns !== null && ownedSiblings.has(ns)) {
        self.append(ns);
        const val = grp1(ns);
        if (grp1LU[val] === undefined) {
            grp1LU[val] = [];
        }
        grp1LU[val].push(ns);
        ns = ns.nextElementSibling;
    }
}
function conditionalCreate(self, item, prevSib) {
    const { grp1, grp1LU, ownedSiblings } = self;
    const val = grp1(item);
    let newEl;
    //test next few siblings for a match
    let ns = prevSib;
    for (let i = 0; i < 4; i++) {
        ns = ns.nextElementSibling;
        if (ns === null || !ownedSiblings.has(ns))
            break;
        if (grp1(ns) === val) {
            newEl = ns;
            break;
        }
    }
    const elementPool = grp1LU[val];
    if (elementPool !== undefined && elementPool.length > 0) {
        newEl = elementPool.pop();
    }
    if (newEl === undefined) {
        newEl = document.createElement(item.localName);
        ownedSiblings.add(newEl);
    }
    applyP(newEl, [item]);
    prevSib.insertAdjacentElement('afterend', newEl);
    return newEl;
}
