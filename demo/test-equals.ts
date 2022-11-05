import {TestEqualsProps, TestEqualsActions} from './types';
import {XE} from '../XE.js';

export class TestEquals extends HTMLElement implements TestEqualsActions{
    doSynch({updateCount, updateCountEcho}: this){
        console.log({updateCount, updateCountEcho});
    }
}

export interface TestEquals extends TestEqualsProps{}

const xe = new XE<TestEqualsProps, TestEqualsActions>({
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
        actions:{
            doSynch: {
                ifEquals: ['updateCount', 'updateCountEcho'],
                ifAllOf: ['updateCount', 'updateCountEcho'],
            }
        }
    },
    superclass: TestEquals,
});