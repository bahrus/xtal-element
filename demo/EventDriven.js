"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
};
var _counter;
class EventDriven extends HTMLElement {
    constructor() {
        super(...arguments);
        _counter.set(this, 0);
    }
    incrementCount() {
        __classPrivateFieldSet(this, _counter, +__classPrivateFieldGet(this, _counter) + 1);
    }
    connectedCallback() {
        let counter = 0;
        const bound = this.incrementCount.bind(this);
        //this.addEventListener('changed', bound);
    }
    start() {
        const start = performance.now();
        const event = new Event('changed', { bubbles: false });
        for (let i = 0; i < 1000000; i++) {
            this.dispatchEvent(event);
        }
        console.log(__classPrivateFieldGet(this, _counter));
        console.log(performance.now() - start);
    }
}
_counter = new WeakMap();
customElements.define('event-driven', EventDriven);
