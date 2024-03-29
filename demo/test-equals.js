import { XE } from '../XE.js';
export class TestEquals extends HTMLElement {
    doSynch({ updateCount, updateCountEcho }) {
        console.log({ updateCount, updateCountEcho });
    }
}
const xe = new XE({
    config: {
        tagName: 'test-equals',
        propDefaults: {
            updateCount: 0,
            updateCountEcho: 0,
        },
        propInfo: {
            updateCount: {
                notify: {
                    echoTo: {
                        key: 'updateCountEcho',
                        delay: 200,
                    }
                }
            }
        },
        actions: {
            doSynch: {
                ifEquals: ['updateCount', 'updateCountEcho'],
                ifAllOf: ['updateCount', 'updateCountEcho'],
            }
        }
    },
    superclass: TestEquals,
});
