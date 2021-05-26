declare type Lock = {
    unlockPromise: Promise<void>;
    lock: () => void;
};
declare class Mutex<T> {
    maxAccesses: number;
    private currentAccesses;
    private locks;
    readonly content: T;
    constructor(content: T, maxAccesses?: number);
    lock(): Promise<{
        content: T;
        unlock: () => void;
    }>;
    processLock(lock: Lock): Promise<void>;
}
export default Mutex;
