declare type Lock = {
    unlockPromise: Promise<void>;
    lock: () => void;
};
declare class Mutex {
    maxAccesses: number;
    currentAccesses: number;
    locks: Array<Lock>;
    content: any;
    constructor(content: any, maxAccesses?: number);
    lock(): Promise<{
        content: any;
        unlock: () => void;
    }>;
    processLock(lock: Lock): Promise<void>;
}
export default Mutex;
