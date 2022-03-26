
export interface XtalCounterProps {
    count?: number;
}

export interface TestEqualsProps {
    updateCount: number;
    updateCountEcho: number;
}

export interface TestEqualsActions{
    doSynch(self: this): void;
}